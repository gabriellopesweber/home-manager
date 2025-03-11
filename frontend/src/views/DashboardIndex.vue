<template>
    <v-container>
        <div class="d-flex justify-center">
            <h1> Bem vindo ao Home Manager</h1>
            <p>{{ message }}</p>
        </div>
    </v-container>
</template>

<script>
import api from "@/api"

export default {
    data() {
        return {
            message: "",
        }
    },
    async created() {
        try {
            const response = await api.get("/home")
            this.message = response.data
        } catch (error) {
            console.error("Erro ao buscar dados:", error)
            this.message = "Erro ao carregar a página"
        }
    },
}
</script>