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
              type="image/svg"
            >
            <div>
              Esqueceu sua senha?
            </div>
          </div>
        </template>

        <template #subtitle>
          <div class="text-center">
            <span> Informe o seu e-mail </span>
          </div>
        </template>
        <v-form 
          ref="form"
          v-model="valid"
        >
          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-text-field
                v-model="email"
                variant="outlined"
                density="comfortable"
                label="E-mail"
                clearable
                :rules="[() => $validation('required', email), () => $validation('email', email)]"
                @keyup.enter="updatePass"
              />
            </v-col>
          </v-row>
        </v-form>
        <template #actions>
          <v-row dense>
            <v-col class="d-flex justify-space-evenly">
              <v-btn
                class="bg-primary"
                type="submite"
                :loading="loading"
                @click="updatePass"
              >
                Solicitar redefinição
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
