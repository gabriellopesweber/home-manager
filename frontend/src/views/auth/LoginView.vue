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
                Entrar
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex align-center flex-column mt-2">
              É seu primeiro acesso? 
              <v-btn
                class="mx-4"
                variant="text"
                :to="{
                  name: 'register'
                }"
              >
                Registre-se
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
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
        }
      } catch {
        this.$showMessage("Ocorreu um problema ao fazer o login!", "error")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>