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
      <!-- Título -->
      <template #title>
        <div class="text-center mb-4">
          <img
            :src="myLogo"
            alt="Logo"
            class="mx-auto mb-2"
            style="height: 75px; width: 200px;"
          >
          <h2 class="text-h6 font-weight-medium text-grey-darken-2">
            Crie uma conta
          </h2>
        </div>
      </template>

      <!-- Formulário -->
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="name"
          variant="outlined"
          label="Seu nome"
          prepend-inner-icon="mdi-account-outline"
          name="register-name"
          clearable
          :rules="[() => $validation('required', name)]"
          class="mb-4"
          @keyup.enter="register"
        />

        <v-text-field
          v-model="email"
          variant="outlined"
          label="E-mail"
          prepend-inner-icon="mdi-email-outline"
          name="register-email"
          clearable
          :rules="[() => $validation('required', email), () => $validation('email', email)]"
          class="mb-4"
          @keyup.enter="register"
        />

        <v-text-field
          v-model="password"
          type="password"
          variant="outlined"
          label="Senha"
          prepend-inner-icon="mdi-lock-outline"
          name="register-pass"
          clearable
          :rules="[() => $validation('required', password), () => $validation('passwordStrength', password)]"
          class="mb-6"
          @keyup.enter="register"
        />
      </v-form>

      <!-- Ações -->
      <template #actions>
        <v-row justify="space-between">
          <v-col
            cols="6"
            class="pa-0 pr-1"
          >
            <v-btn
              block
              variant="outlined"
              color="grey"
              name="toLogin"
              :to="{ name: 'login' }"
            >
              Voltar
            </v-btn>
          </v-col>
          <v-col
            cols="6"
            class="pa-0 pl-1"
          >
            <v-btn
              block
              class="bg-success"
              name="register"
              :loading="loading"
              @click="register"
            >
              Cadastrar
              <v-icon
                end
                class="ml-2"
              >
                mdi-account-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </BaseMaterialCard>
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
