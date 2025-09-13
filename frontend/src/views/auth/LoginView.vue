<template>
  <v-container
    class="d-flex justify-center align-center fill-height"
    fluid
  >
    <BaseMaterialCard
      class="pa-6"
      max-width="500"
      width="500"
      elevation="10"
      rounded="xl"
    >
      <template #title>
        <div class="text-center mb-4">
          <img
            :src="myLogo"
            alt="Logo"
            class="mx-auto mb-2"
            style="height: 75px; width: 200px;"
          >
          <h2 class="text-h6 font-weight-medium text-grey-darken-2">
            Seja bem-vindo
          </h2>
        </div>
      </template>

      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="email"
          variant="outlined"
          label="E-mail"
          name="login-email"
          prepend-inner-icon="mdi-email-outline"
          clearable
          :rules="[() => $validation('required', email), () => $validation('email', email)]"
          class="mb-4"
          @keyup.enter="login"
        />

        <v-text-field
          v-model="password"
          type="password"
          variant="outlined"
          label="Senha"
          name="login-pass"
          prepend-inner-icon="mdi-lock-outline"
          clearable
          :rules="[() => $validation('required', password)]"
          class="mb-4"
          @keyup.enter="login"
        />

        <v-btn
          block
          color="primary"
          class="mb-4"
          name="login"
          :loading="loading"
          @click="login"
        >
          Entrar
          <v-icon
            end
            class="ml-2"
          >
            mdi-login
          </v-icon>
        </v-btn>

        <div class="d-flex justify-space-between">
          <v-btn
            variant="text"
            size="small"
            :to="{ name: 'register' }"
          >
            Criar conta
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            :to="{ name: 'forgotPassword' }"
          >
            Esqueceu a senha?
          </v-btn>
        </div>
      </v-form>
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import BaseMaterialCard from "@/components/BaseMaterialCard.vue"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

export default {
  components: {
    BaseMaterialCard,
  },
  setup () {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  data () {
    return {
      email: "",
      password: "",
      valid: false,
      loading: false,
      myLogo: `${import.meta.env.BASE_URL}img/HomeManager-Black.svg`,
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        this.$refs.form.validate()
        if (this.valid) {
          await this.authStore.login(this.email, this.password)
          this.router.push({
            name: 'dashboard'
          })
          this.$showMessage("Login efetuado!", "success")
        }
      } catch (error) {
        if (error?.status === 400) {
          return this.$showMessage("Usuario e senha invalidos!", "error")
        }
        
        return this.$showMessage("Ocorreu um problema ao fazer o login!", "error")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>