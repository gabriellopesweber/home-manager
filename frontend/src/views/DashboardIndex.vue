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
  }
}
</script>