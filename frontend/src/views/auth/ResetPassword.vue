<template>
  <v-container
    class="d-flex justify-center fill-height"
    fluid
  >
    <v-form 
      ref="form"
      v-model="valid"
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
                Redefinição de senha
              </div>
            </div>
          </template>
        
          <template #subtitle>
            <div class="text-center">
              <span> Informe a nova senha </span>
            </div>
          </template>

          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-text-field
                v-model="newPassword"
                type="password"
                variant="outlined"
                label="Nova senha"
                clearable
                :rules="[() => $validation('required', newPassword), () => $validation('passwordStrength', newPassword)]"
                @keyup.enter="validateAndUpdate"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <v-text-field
                v-model="confirmationPassword"
                type="password"
                variant="outlined"
                label="Confirme sua senha"
                clearable
                :rules="[
                  () => $validation('required', confirmationPassword), 
                  () => $validation('passwordIsSomeIqual', newPassword, confirmationPassword),
                  () => $validation('passwordStrength', confirmationPassword)
                ]"
                @keyup.enter="validateAndUpdate"
              />
            </v-col>
          </v-row>
          <template #actions>
            <v-row dense>
              <v-col class="d-flex justify-space-evenly">
                <v-btn
                  class="bg-success"
                  :loading="loading"
                  @click="validateAndUpdate"
                >
                  Atualizar
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </BaseMaterialCard>
      </v-row>
    </v-form>
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
