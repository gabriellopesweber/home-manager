describe('Fluxo completo de cadastro de lançamentos', () => {
  const name = 'Testes';
  const email = 'skailaini@gmail.com';
  const senha = 'A12345678';

  before(() => {
    cy.registerUser(name, email, senha)
  });

  it('Deve criar uma conta, lançar um receita e uma despesa e excluir a conta', () => {
    cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/authorization/login`).as('loginReq')

    cy.login(false, email, senha)

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/')

    cy.exeLaunch()

  });
});
