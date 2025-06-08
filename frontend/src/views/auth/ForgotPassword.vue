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
            Esqueceu sua senha?
          </h2>
        </div>
      </template>

      <template #subtitle>
        <div class="text-center mb-4 text-body-2 text-grey-darken-1">
          Informe o seu e-mail para redefinir sua senha
        </div>
      </template>

      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="email"
          variant="outlined"
          density="comfortable"
          label="E-mail"
          prepend-inner-icon="mdi-email-outline"
          clearable
          :rules="[() => $validation('required', email), () => $validation('email', email)]"
          class="mb-4"
          @keyup.enter="updatePass"
        />
      </v-form>

      <template #actions>
        <v-row justify="center">
          <v-btn
            class="bg-primary"
            type="submit"
            append-icon="mdi-email-fast-outline"
            :loading="loading"
            @click="updatePass"
          >
            Solicitar redefinição
          </v-btn>
        </v-row>
      </template>
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import BaseMaterialCard from "@/components/BaseMaterialCard.vue"
import AuthService from "@/services/authService"

export default {
  components: {
    BaseMaterialCard,
  },
  data() {
    return {
      email: "",
      valid: false,
      loading: false,
      myLogo: `${import.meta.env.BASE_URL}img/HomeManager-Black.svg`,
    }
  },
  methods: {
    async updatePass() {
      try {
        this.loading = true
        this.$refs.form.validate()
        if (this.valid) {
          await AuthService.forgotPassword(this.email)
          this.$router.push({
            name: 'login'
          })
          this.$showMessage("E-mail enviado com sucesso!", "success")
        }
      } catch (e) {
        if (e.status === 400) {
          this.$showMessage("E-mail não encontrado!", "error")
          return 
        }
        this.$showMessage("Ocorreu um problema ao enviar o e-mail!", "error")
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
