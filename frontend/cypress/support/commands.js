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

  cy.get('button[name="login"]').click()
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
