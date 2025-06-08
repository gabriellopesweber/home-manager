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
            Redefinição de senha
          </h2>
        </div>
      </template>

      <template #subtitle>
        <div class="text-center mb-4">
          <span>Informe a nova senha</span>
        </div>
      </template>

      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="newPassword"
          type="password"
          variant="outlined"
          label="Nova senha"
          prepend-inner-icon="mdi-lock-reset"
          clearable
          class="mb-4"
          :rules="[
            () => $validation('required', newPassword),
            () => $validation('passwordStrength', newPassword)
          ]"
          @keyup.enter="validateAndUpdate"
        />

        <v-text-field
          v-model="confirmationPassword"
          type="password"
          variant="outlined"
          label="Confirme sua senha"
          prepend-inner-icon="mdi-lock-check-outline"
          clearable
          class="mb-6"
          :rules="[
            () => $validation('required', confirmationPassword),
            () => $validation('passwordIsSomeIqual', newPassword, confirmationPassword),
            () => $validation('passwordStrength', confirmationPassword)
          ]"
          @keyup.enter="validateAndUpdate"
        />
      </v-form>

      <template #actions>
        <v-row>
          <v-col
            cols="12"
            class="pa-0"
          >
            <v-btn
              block
              class="bg-success"
              :loading="loading"
              @click="validateAndUpdate"
            >
              Atualizar
              <v-icon
                end
                class="ml-2"
              >
                mdi-check
              </v-icon>
            </v-btn>
          </v-col>
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
      token: "",
      newPassword: "",
      confirmationPassword: "",
      valid: false,
      loading: false,
      myLogo: `${import.meta.env.BASE_URL}img/HomeManager-Black.svg`,
    }
  },
  created () {
    this.token = this.$route.query.token || ''
  },
  methods: {
    async validateAndUpdate () {
      try {
        this.loading = true
        this.$refs.form.validate()

        if (this.valid) {
          if (this.newPassword === this.confirmationPassword) {
            await this.updatePass()
          }
        }
      } catch {
        this.$showMessage("Ocorreu um problema ao atualizar a senha!", "error")
      } finally {
        this.loading = false
      }
    },
    async updatePass () {
      await AuthService.resetPassword(this.token, this.confirmationPassword)
      this.$router.push({
        name: 'login'
      })
      this.$showMessage("Senha atualizada com sucesso!", "success")
    },
  },
}
</script>
