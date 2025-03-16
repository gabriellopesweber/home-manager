<template>
  <v-container fluid>
    <BaseMaterialCard>
      <template #title>
        <div class="d-flex justify-center">
          <h3>
            Bem vindo ao Home Manager
          </h3>
        </div>
      </template>
      <template #default>
        <div class="d-flex justify-center">
          <p v-if="!loading">
            {{ message }}
          </p>
          <v-skeleton-loader 
            v-if="loading"
            type="text"
            width="300"
          />
        </div>
      </template>
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import api from "@/api"
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  name: "DashboardIndex",
  components: {
    BaseMaterialCard
  },
  data() {
    return {
      message: "",
      loading: false
    }
  },
  async created() {
    try {
      this.loading = true
      const response = await api.get("/home")
      this.message = response.data
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      this.message = "Erro ao carregar a página"
    } finally {
      this.loading = false
    }
  },
}
</script>