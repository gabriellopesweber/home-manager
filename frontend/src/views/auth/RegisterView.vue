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
      <v-form 
        ref="form"
        v-model="valid"
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
                type="image/svg"
              >
              <div>
                Crie uma conta
              </div>
            </div>
          </template>
        
          <v-row dense>
            <v-col class="d-flex align-center justify-center">
              <v-text-field
                v-model="name"
                variant="outlined"
                label="Seu nome"
                name="register-name"
                clearable
                :rules="[() => $validation('required', name)]"
                @keyup.enter="register"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex align-center justify-center">
              <v-text-field
                v-model="email"
                variant="outlined"
                label="E-mail"
                name="register-email"
                clearable
                :rules="[() => $validation('required', email), () => $validation('email', email)]"
                @keyup.enter="register"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-text-field
                v-model="password"
                type="password"
                variant="outlined"
                label="Senha"
                name="register-pass"
                clearable
                :rules="[() => $validation('required', password), () => $validation('passwordStrength', password)]"
                @keyup.enter="register"
              />
            </v-col>
          </v-row>
        
          <template #actions>
            <v-row dense>
              <v-col class="d-flex justify-space-evenly">
                <v-btn
                  variant="outlined"
                  name="toLogin"
                  :to="{
                    name: 'login'
                  }"
                >
                  Voltar
                </v-btn>
                <v-btn
                  class="bg-success"
                  :loading="loading"
                  name="register"
                  @click="register"
                >
                  Cadastrar
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </BaseMaterialCard>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from "@/services/authService"

import BaseMaterialCard from "@/components/BaseMaterialCard.vue"

export default {
  components: {
    BaseMaterialCard,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      valid: false,
      loading: false,
      myLogo: `${import.meta.env.BASE_URL}img/HomeManager-Black.svg`,
    }
  },
  methods: {
    async register() {
      try {
        this.loading = true
        this.$refs.form.validate()
        if (this.valid) {
          await AuthService.register(this.name, this.email, this.password)
          this.$router.push({
            name: 'login'
          })
          this.$showMessage("Usuario cadastrado com sucesso!", "success")
        }
      } catch {
        this.$showMessage("Ocorreu um problema ao cadastrar o usuario!", "error")
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
