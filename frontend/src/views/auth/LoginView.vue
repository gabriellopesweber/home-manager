<template>
  <v-container
    class="d-flex justify-center fill-height"
    fluid
  >
    <v-row
      dense
      align="center"
      justify="center"
    >
      <BaseMaterialCard
        elevation="5"
        width="500"
      >
        <template #title>
          <div class="text-center">
            <img
              class="mx-auto"
              :src="myLogo"
              style="height: 75px; width: 200px;"
            >
            <div>
              Seja bem vindo
            </div>
          </div>
        </template>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-row dense>
            <v-col class="d-flex align-center justify-center">
              <v-text-field
                v-model="email"
                variant="outlined"
                label="E-mail"
                clearable
                :rules="[() => $validation('required', email), () => $validation('email', email)]"
                @keyup.enter="login"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-text-field
                v-model="password"
                type="password"
                variant="outlined"
                clearable
                label="Senha"
                :rules="[() => $validation('required', password)]"
                @keyup.enter="login"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-btn
                color="primary"
                :loading="loading"
                @click="login"
              >
                <span> Entrar </span>
                <v-icon class="ml-2">
                  mdi-login
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <template #actions>
          <v-row dense>
            <v-col class="d-flex align-center justify-center">
              <v-btn
                class="mx-4"
                variant="text"
                :to="{
                  name: 'register'
                }"
              >
                Registre-se
              </v-btn>
              <v-btn
                class="mx-4"
                variant="text"
                :to="{
                  name: 'forgotPassword'
                }"
              >
                Esqueceu a senha?
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </BaseMaterialCard>
    </v-row>
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
      myLogo: "/img/HomeManager-Black.svg",
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