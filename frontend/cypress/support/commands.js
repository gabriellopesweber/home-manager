Cypress.Commands.add('register', (name, email, pass) => {
  cy.visit('/register')

  cy.get('input[name="register-name"]').type(name)
  cy.get('input[name="register-email"]').type(email)
  cy.get('input[name="register-pass"]').type(pass)

  cy.get('button[name="register"]').click()
})

Cypress.Commands.add('login', (isRegistered, email, pass) => {
  if (isRegistered) {
    cy.url().should('include', '/login')
  } else {
    cy.visit('/login')
  }

  cy.get('input[name="login-email"]').type(email)
  cy.get('input[name="login-pass"]').type(pass, { log: false })

  cy.get('button[name="login"]', { timeout: 10000 }).click()
})

Cypress.Commands.add('resetUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_API_URL')}/authorization/login`,
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      const token = response.body.token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.id || payload.sub

      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('VITE_API_URL')}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false
      }).then((res) => {
        Cypress.log({ name: 'deleteUser', message: `Usuário ${userId} removido`, consoleProps: () => res })
      })
    } else {
      Cypress.log({ name: 'deleteUser', message: 'Usuário não encontrado ou token inválido' })
    }
  })
})

Cypress.Commands.add('registerUser', (name, email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_API_URL')}/authorization/register`,
    body: { name, email, password },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('Usuário criado ou já existente')
  });
})

Cypress.Commands.add('exeLaunch', () => {
  // cy.addAccount()

  cy.pathLaunch()

  cy.createIncomeOrExpense('despesa')
  cy.createIncomeOrExpense('receita')
})

Cypress.Commands.add('pathLaunch', () => {
  // Navega para lançamentos
  cy.visit('/gerenciamento/lancamentos');

  cy.url().should('include', '/gerenciamento/lancamentos');
})

Cypress.Commands.add('addAccount', () => {
  // Navega para lançamentos
  cy.visit('/gerenciamento/contas');

  cy.url().should('include', '/gerenciamento/contas');

  cy.createAccount('despesa')
})

Cypress.Commands.add('createIncomeOrExpense', (type) => {
  cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/income/`).as('createIncomeReq')
  cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/expense/`).as('createExpenseReq')

  cy.get(`[data-cy="speed-dial-despesa"]`).within(() => {
    cy.get(`[data-cy="open-create-${type}"]`)
      .invoke('css', 'pointer-events', 'auto')
      .click({ force: true })
  });

  cy.get('[data-cy="dialog"]').should('exist')

  cy.get('input[name="description"]').type('Despesa de teste');

  cy.get('input[name="date"]')
    .should('exist')
    .click({ force: true });

  cy.get('[data-cy="date-picker"]')
    .find('button')
    .contains(/^1$/)
    .click({ force: true });

  cy.get('input[name="value"]').clear().type('12345', { force: true });

  cy.get('[name="category"]').click({ force: true });
  cy.get('[data-cy^="category-option-"]')
    .first()
    .should('be.visible')
    .click({ force: true });

  cy.get('[name="account"]').click({ force: true });
  cy.get('[data-cy^="account-option-"]')
    .first()
    .should('be.visible')
    .click({ force: true });

  cy.get('[data-cy="open-create-one"]', { timeout: 10000 })
    .should('exist')
    .click({ force: true });

  if (type === 'despesa') {
    cy.wait('@createExpenseReq').its('response.statusCode').should('eq', 201)
  } else {
    cy.wait('@createIncomeReq').its('response.statusCode').should('eq', 201)
  }

  cy.contains('Cadastro efetuado!', { timeout: 10000 }).should('be.visible')
})

Cypress.Commands.add('createAccount', () => {
  cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/account/`).as('createAccountReq')

  cy.get(`button[data-cy="openCreateAccount"]`, { timeout: 10000 })
    .should('exist')
    .click({ force: true });

  // Aguarda a abertura da modal
  cy.get('[data-cy="dialog"]', { timeout: 10000 }).should('exist');

  cy.get('[data-cy="dialog"]').within(() => {
    cy.get('[data-cy="accountName"] input')
      .should('exist')
      .type('Conta de teste', { force: true });

    cy.get('[data-cy="accountBalance"] input')
      .should('exist')
      .type('500', { force: true });

    cy.get('button[data-cy="createAccount"]').click({ force: true });
  });

  cy.wait('@createAccountReq').its('response.statusCode').should('eq', 201)

  cy.contains('Cadastrado com sucesso!', { timeout: 10000 }).should('be.visible')
})

