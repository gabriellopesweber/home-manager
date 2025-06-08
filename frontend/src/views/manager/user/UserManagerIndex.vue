<template>
  <v-container
    fluid
    class="mt-5 d-flex justify-center"
  >
    <BaseMaterialCard
      width="800"
      class="pa-6"
      elevation="10"
      rounded="xl"
    >
      <template #title>
        <span class="text-h6 font-weight-medium">Configurações de Usuário</span>
      </template>

      <!-- Informações do usuário -->
      <v-row dense>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.name"
            label="Nome"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            :readonly="!editMode"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.email"
            label="E-mail"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            disabled
            :readonly="true"
          />
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-end"
        >
          <v-btn
            class="mr-2"
            variant="outlined"
            color="primary"
            @click="toggleEditMode"
          >
            {{ editMode ? 'Cancelar' : 'Editar' }}
          </v-btn>

          <v-btn
            color="success"
            :disabled="!editMode"
            :loading="loading"
            @click="updateUser"
          >
            Salvar
          </v-btn>

          <v-btn
            color="error"
            variant="outlined"
            class="ml-2"
            @click="showDeleteDialog = true"
          >
            Deletar conta
          </v-btn>
        </v-col>
      </v-row>

      <!-- Compartilhar acesso -->
      <v-divider class="my-6" />
      <v-row dense>
        <v-col cols="12">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">
            Compartilhar acesso
          </h3>
          <v-text-field
            v-model="sharedEmail"
            label="E-mail da pessoa"
            variant="outlined"
            prepend-inner-icon="mdi-account-plus"
            clearable
          />
          <v-btn
            color="primary"
            disabled
            @click="shareAccess"
          >
            Compartilhar
          </v-btn>
          <small class="text-grey">* Funcionalidade ainda não implementada</small>
        </v-col>
      </v-row>

      <!-- Contas compartilhadas -->
      <v-divider class="my-6" />
      <v-row dense>
        <v-col cols="12">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">
            Contas com acesso compartilhado
          </h3>
          <v-table>
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Data de compartilhamento</th>
                <th class="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(account, index) in sharedAccounts"
                :key="index"
              >
                <td>{{ account.email }}</td>
                <td>{{ formatDate(account.sharedAt) }}</td>
                <td class="text-end">
                  <v-btn
                    variant="text"
                    icon="mdi-delete-outline"
                    color="error"
                    @click="revokeAccess(account.email)"
                  />
                </td>
              </tr>
              <tr v-if="!sharedAccounts.length">
                <td
                  colspan="3"
                  class="text-center text-grey"
                >
                  Nenhum acesso compartilhado encontrado.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </BaseMaterialCard>

    <GlobalConfirmEdit
      v-model="showDeleteDialog"
      title="Tem certeza que deseja deletar sua conta?"
      text="Essa ação é irreversível. Todos os seus dados serão excluídos."
      ok-text="Deletar"
      cancel-text="Cancelar"
      color="error"
      @confirm="deleteAccount"
    />
  </v-container>
</template>

<script>
import { useAuthStore } from "@/stores/authStore"

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import UsersService from '@/services/UsersService'
import GlobalConfirmEdit from "@/components/GlobalConfirmEdit.vue"

export default {
  components: {
    BaseMaterialCard,
    GlobalConfirmEdit
  },
  data() {
    return {
      loading: false,
      editMode: false,
      showDeleteDialog: false,
      user: {
        name: '',
        email: '',
      },
      sharedEmail: '',
      sharedAccounts: [],
    }
  },
  created() {
    this.fetchUser()
  },
  methods: {
    async fetchUser() {
      const authStore = useAuthStore()
      try {
        const userId = authStore.user.id // ou outro identificador
        const res = await UsersService.getById(userId)
        this.user = res
      } catch {
        this.$showMessage('Erro ao carregar dados do usuário', 'error')
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode
    },
    async updateUser() {
      this.loading = true
      try {
        const { _id, name, email } = this.user
        await UsersService.update(_id, { name, email })
        this.editMode = false
        this.$showMessage('Dados atualizados com sucesso', 'success')
      } catch {
        this.$showMessage('Erro ao atualizar dados do usuário', 'error')
      } finally {
        this.loading = false
      }
    },
    async deleteAccount() {
      this.loading = true
      try {
        const authStore = useAuthStore()

        const { _id } = this.user
        await UsersService.deleteById(_id)

        authStore.logout()
        this.$router.push({ name: 'login' })
        this.$showMessage('Conta deletada com sucesso', 'success')
      } catch {
        this.$showMessage('Erro ao deletar conta', 'error')
      } finally {
        this.loading = false
      }
    },
    shareAccess() {
      this.$showMessage('Funcionalidade ainda não implementada', 'info')
    },
    revokeAccess(email) {
      this.sharedAccounts = this.sharedAccounts.filter(acc => acc.email !== email)
      this.$showMessage('Acesso revogado', 'info')
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
    },
  },
}
</script>
