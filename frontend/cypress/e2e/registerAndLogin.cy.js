describe('Fluxo completo: cadastro e login', () => {
  const name = 'home manager teste'
  const email = 'homemanagerdev@gmail.com'
  const pass = 'S123456'
  const isRegistered = true

  // Para remover o usuario no inicio do teste
  before(() => {
    cy.resetUser(email, pass)
  })

  // Para remover o usuario de teste após o teste
  after(() => {
    cy.resetUser(email, pass)
  })

  it('Deve cadastrar, fazer o login, deslogar e deletar o usuario', () => {
    cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/authorization/register`).as('registerReq')
    cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/authorization/login`).as('loginReq')

    cy.register(name, email, pass)

    cy.wait('@registerReq').its('response.statusCode').should('eq', 201)

    cy.login(isRegistered, email, pass)

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/')

    cy.get('button[name="logout"]').click()

    cy.url().should('include', '/login')
  })
})
