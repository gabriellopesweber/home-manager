<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Bancos">
      <v-row v-if="loading">
        <v-col
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            class="mx-auto rounded-xl"
            type="list-item-avatar-two-line"
            elevation="4"
          />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col
          v-for="(account, index) in itemsAccount"
          :key="index"
          cols="12"
          md="4"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              elevation="4"
              :loading="loadingItem[account.id]"
            >
              <v-list>
                <v-list-item>
                  <template #prepend>
                    <v-avatar> 
                      <v-icon
                        icon="mdi-bank"
                        size="x-large"
                      />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="d-flex align-center">
                    <v-icon icon="mdi-piggy-bank-outline" />
                    <span class="ml-2"> {{ account.name }} </span>
                  </v-list-item-title>

                  <v-list-item-title class="d-flex align-center"> 
                    <v-icon icon="mdi-currency-brl" />
                    <span class="ml-2"> {{ formatAmount(account.balance) }} </span>
                  </v-list-item-title>

                  <template #append>
                    <div class="d-flex justify-center align-center">
                      <v-btn
                        v-if="isHovering"
                        v-tooltip:top="'Editar'"
                        icon="mdi-pencil"
                        rounded="circle"
                        color="primary"
                        size="small"
                        @click="() => {
                          itemMarkedToManager = account
                          dialog = true
                        }"
                      />
                      <v-btn
                        v-if="isHovering"
                        v-tooltip:top="'Deletar'"
                        class="ml-2"
                        icon="mdi-trash-can-outline"
                        rounded="circle"
                        color="error"
                        size="small"
                        @click="() => {
                          itemMarkedToManager = account
                          showConformEdit = true
                        }"
                      />
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-hover>
        </v-col>

        <v-col
          cols="12"
          md="4"
          align-self="center"
        >
          <v-card
            class="d-flex justify-center align-center h-100 py-1"
            elevation="4"
          >
            <v-btn
              v-tooltip:top="'Cadastrar'"
              class="my-2"
              icon="mdi-plus"
              rounded="circle"
              @click="dialog = true"
            />
          </v-card>
        </v-col>
      </v-row>
    </BaseMaterialCard>

    <GlobalConfirmEdit
      v-model="showConformEdit"
      title="Excluir Item"
      text="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      ok-text="Sim, excluir"
      cancel-text="Cancelar"
      color="error"
      :item="itemMarkedToManager"
      @confirm="deleteAccount"
      @cancel="itemMarkedToManager = {}"
    />
    
    <AccountMananger 
      v-model="dialog"
      :edit-item="itemMarkedToManager"
      @update:model-value="itemMarkedToManager = {}"
      @insert:item="eventAfterCreate"
    />
  </v-container>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import AccountService from '../../../services/AccountService'
import AccountMananger from './AccountMananger.vue'
import GlobalConfirmEdit from '@/components/GlobalConfirmEdit.vue'

export default {
  name: "AccountIndex",
  components: {
    BaseMaterialCard,
    AccountMananger,
    GlobalConfirmEdit
  },
  data() {
    return {
      loading: false,
      dialog: false,
      showConformEdit: false,
      itemMarkedToManager: {},
      itemsAccount: [],
      loadingItem: []
    }
  },
   computed: {
    formatAmount() {
      return value => formatCurrencyMaskBR(value)
    },
  },
  async created() {
    try {
      this.loading = true
      this.itemsAccount = await AccountService.getAll()
    } catch {
      this.$showMessage('Ocorreu um problema ao buscar contas', 'error')
    } finally {
      this.loading = false
    }
  },
  methods: {
    eventAfterCreate(event) {
      const index = this.itemsAccount.findIndex(i => i.id === event.id)
      
      if (typeof index === 'number' && index >= 0) {
        this.itemsAccount[index] = event
      } else {
        this.itemsAccount.push(event)
      }
    },
    async deleteAccount() {
      const id = this.itemMarkedToManager.id
      try {
        this.loadingItem[id] = true
        await AccountService.deleteById(id)

        this.itemsAccount = this.itemsAccount.filter(item => item.id !== id)
        
        this.$showMessage('Item excluido com sucesso!', 'success')
      } catch {
        this.$showMessage('Ocorre um problema ao excluir!', 'error')
      } finally {
        this.itemMarkedToManager = {}
        this.loadingItem[id] = false
      }
    }
  }
}
</script>