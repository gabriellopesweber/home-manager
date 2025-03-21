<template>
  <div>
    <h2>Login</h2>
    <v-text-field
      v-model="email"
      placeholder="Email"
    />
    <v-text-field
      v-model="password"
      type="password"
      placeholder="Senha"
    />
    <v-btn @click="login">
      Entrar
    </v-btn>
  </div>
</template>


<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push("/dashboard")
  } catch (error) {
    alert(error.message || "Erro ao fazer login")
  }
}
</script>

