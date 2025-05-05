/**
 * Formata os valores de retorno para Account
 * @param {Object} account 
 */
export function formatAccountItem(account) {
  if (!account) return {}

  return {
    id: account._id,
    name: account.name,
    balance: account.balance,
    open_balance: account.openBalance,
    update_date: account.updateDate,
    user: account.user
  }
}

/**
 * Formata os valores de retorno para Card
 * @param {Object} card 
 */
export function formatCardItem(card) {
  if (!card) return {}

  return {
    id: card._id,
    name: card.name,
    account: card.account,
    brand: card.brand,
    type: card.type,
    last_four_digits: card.numberLast4,
    limit: card.limit,
    due_date: card.dueDate,
    closing_date: card.closingDate,
    is_active: card.isActive,
    created_at: card.createdAt,
    user: card.user
  }
}

/**
 * Formata os valores de retorno para Category
 * @param {Object} category 
 */
export function formatCategoryItem(category) {
  if (!category) return {}

  return {
    id: category._id,
    name: category.name,
    type: category.type,
    user: category.user
  }
}

/**
 * Formata um objeto de despesa para uso padronizado
 *
 * @param {Object} expense - Objeto de despesa original
 * @param {boolean} showType - Se verdadeiro, inclui o campo "type"
 * @returns {Object} Objeto formatado da despesa
 */
export function formatExpenseItem(expense = {}, showType = false) {
  const {
    _id: id,
    category,
    status,
    value,
    executionDate: execution_date,
    date,
    description,
    account,
    user
  } = expense

  return {
    id,
    category,
    status,
    value,
    execution_date,
    date,
    description,
    account,
    user,
    ...(showType && { type: 'expense' })
  }
}

/**
 * Formata um objeto de receita para uso padronizado
 *
 * @param {Object} income - Objeto de receita original
 * @param {boolean} showType - Se verdadeiro, inclui o campo "type"
 * @returns {Object} Objeto formatado da receita
 */
export function formatIncomeItem(income = {}, showType = false) {
  const {
    _id: id,
    category,
    status,
    value,
    executionDate: execution_date,
    date,
    description,
    account,
    user
  } = income

  return {
    id,
    category,
    status,
    value,
    execution_date,
    date,
    description,
    account,
    user,
    ...(showType && { type: 'income' })
  }
}

/**
 * Formata um objeto de transferência para uso padronizado
 *
 * @param {Object} transfer - Objeto de transferência original
 * @param {boolean} showType - Se verdadeiro, inclui o campo "type"
 * @returns {Object} Objeto formatado da transferência
 */
export function formatTransferItem(transfer = {}, showType = false) {
  const {
    _id: id,
    originAccount: origin_account,
    destinationAccount: destination_account,
    status,
    updateDate: update_date,
    value,
    date,
    description,
    user
  } = transfer

  return {
    id,
    origin_account,
    destination_account,
    status,
    update_date,
    value,
    date,
    description,
    user,
    ...(showType && { type: 'transfer' })
  }
}