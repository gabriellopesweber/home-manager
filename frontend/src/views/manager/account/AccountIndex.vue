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
                    <v-fade-transition>
                      <div
                        v-if="isHovering"
                        class="d-flex justify-center align-center"
                      >
                        <!-- <v-btn
                          v-tooltip:top="isCardCreated[account.id] ? 'Editar Cartão' : 'Cadastrar Cartão'"
                          icon="mdi-credit-card-outline"
                          rounded="circle"
                          color="primary"
                          size="small"
                          @click="handleShowEditCard(account.id)"
                        /> -->
                        <v-btn
                          v-tooltip:top="'Editar'"
                          class="ml-2"
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
                          v-tooltip:top="'Deletar'"
                          class="ml-2"
                          icon="mdi-trash-can-outline"
                          rounded="circle"
                          color="error"
                          size="small"
                          @click="async () => {
                            itemMarkedToManager = account
                            await findAssociatedTotal(account.id)
                            showConformEdit = true
                          }"
                        />
                      </div>
                    </v-fade-transition>
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
              data-cy="openCreateAccount"
              @click="dialog = true"
            />
          </v-card>
        </v-col>
      </v-row>
    </BaseMaterialCard>

    <GlobalConfirmEdit
      v-model="showConformEdit"
      title="Excluir conta bancaria"
      ok-text="Sim, excluir"
      cancel-text="Cancelar"
      color="error"
      :item="itemMarkedToManager"
      @confirm="deleteAccount"
      @cancel="itemMarkedToManager = {}"
    >
      <v-alert
        type="warning"
        border="start"
        variant="tonal"
      >
        <span class="font-weight-black"> A exclusão da conta é permanente </span>
        
        <ul style="list-style: disc; padding-left: 1.5rem;">
          <li v-if="associatedTotal > 0">
            Ao excluir será removido {{ `${associatedTotal} ${associatedTotal > 1 ? 'lançamentos' : 'lançamento'}` }} 
          </li>
          <li v-if="isCardAssociated">
            Existe um cartão associado que será excluido
          </li>
        </ul>
      </v-alert>
    </GlobalConfirmEdit>
    
    <CardManager 
      v-model="showCardManager"
      :edit-item="itemMarkedToManager"
      :account-id="accountId"
      @update:model-value="itemMarkedToManager = {}"
      @insert:item="searchCards"
    />
    <AccountManager 
      v-model="dialog"
      :edit-item="itemMarkedToManager"
      @update:model-value="itemMarkedToManager = {}"
      @insert:item="eventAfterCreate"
    />
  </v-container>
</template>

<script>
import AccountService from '../../../services/AccountService'
import CardService from '../../../services/CardService'
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import AccountManager from '@/views/manager/account/AccountManager.vue'
import CardManager from '@/views/manager/account/CardManager.vue'
import GlobalConfirmEdit from '@/components/GlobalConfirmEdit.vue'

export default {
  components: {
    BaseMaterialCard,
    AccountManager,
    CardManager,
    GlobalConfirmEdit
  },
  data() {
    return {
      loading: false,
      dialog: false,
      showConformEdit: false,
      showCardManager: false,
      itemMarkedToManager: {},
      itemsAccount: [],
      itemsCard: [],
      isCardCreated: [],
      loadingItem: [],
      accountId: '',
      associatedTotal: 0
    }
  },
   computed: {
    formatAmount() {
      return value => formatCurrencyMaskBR(value)
    },
    isCardAssociated() {
      return this.itemsCard.some(card => card.account === this.itemMarkedToManager.id)
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.loading = true
        this.itemsAccount = await AccountService.getAll()
        await this.searchCards()
      } catch {
        this.$showMessage('Ocorreu um problema ao buscar contas', 'error')
      } finally {
        this.loading = false
      }
    },
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

        if (this.isCardAssociated) {

        const cardId = this.itemsCard.find(card => card.account = id)

        if (!await CardService.deleteById(cardId.id)) {
            throw new Error
          }
        }
        
        if (!await AccountService.deleteById(id)) {
          throw new Error
        }

        this.itemsAccount = this.itemsAccount.filter(item => item.id !== id)
        
        this.$showMessage('Item excluido com sucesso!', 'success')
      } catch {
        this.$showMessage('Ocorre um problema ao excluir!', 'error')
      } finally {
        this.itemMarkedToManager = {}
        this.loadingItem[id] = false
      }
    },
    async findAssociatedTotal(id) {
      try {
        this.loadingItem[id] = true
        const data = await AccountService.getTotalAssociated(id)
        if (typeof data.quantity === "number") {
          this.associatedTotal = data.quantity
        }
      } catch {
        this.$showMessage('Falha ao buscar total de contas bancarias associadas', 'error')
      } finally {
        this.loadingItem[id] = false
      }
    },
    // Deixando comentada pois não há tempo para desenvolver o restante da logica para faturas
    // handleShowEditCard(accountId) {
    //   const find = this.itemsCard.find(card => card.account === accountId)
    //   if (find) {
    //     this.itemMarkedToManager = find
    //   } else {
    //     this.accountId = accountId
    //   }
      
    //   this.showCardManager = true
    // },
    async searchCards() {
      this.itemsCard = await CardService.getAll()
      
      this.itemsAccount.map(account => {
        const find = this.itemsCard.some(card => account.id === card.account)
        if (find) {
          this.isCardCreated[account.id] = true
        }
      })
    }
  }
}
</script>