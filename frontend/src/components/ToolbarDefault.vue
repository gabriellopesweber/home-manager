<template>
  <v-navigation-drawer
    absolute
  >
    <v-list
      density="comfortable"
      nav
    >
      <v-list-item>
        <template #title>
          <div class="d-flex align-center justify-center">
            <v-icon>
              mdi-currency-usd
            </v-icon>
            <span> Home Manager </span>
          </div>
        </template>
      </v-list-item>
      <v-divider />
      <div class="mt-2">
        <v-list-item 
          link
          prepend-icon="mdi-view-dashboard"
          active-color="primary"
          title="Dashboard"
          :to="{ name: 'dashboard' }"
        />
        <v-list-group
          value="reports"
          prepend-icon="mdi-file-document"
          active-color="primary"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              link
              
              title="Relatórios"
            />
          </template>

          <v-list-item
            link
            title="Relatorio de Entradas"
            :to="{ name: 'relatorio.receitas' }"
          />
        
          <v-list-item
            link 
            title="Relatorio de Saidas"
            :to="{ name: 'relatorio.saidas' }"
          />
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar title="HomeManager">
    <v-spacer />
    <v-list>
      <v-list-item 
        subtitle="teste@google.com"
        title="Test"
      >
        <template #append>
          <v-btn 
            icon="mdi-menu-down"
            size="small"
            rounded="circular"
            variant="text" 
          />
        </template>
      </v-list-item>
    </v-list>
  </v-app-bar>
</template>

<script>
export default {
  name: "ToolbarDefault"
}
</script>