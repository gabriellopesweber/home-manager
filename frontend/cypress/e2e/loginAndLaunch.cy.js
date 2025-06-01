describe('Fluxo completo de cadastro de lançamentos', () => {
  const name = 'Testes';
  const email = 'skailaini@gmail.com';
  const senha = 'A12345678';

  before(() => {
    cy.registerUser(name, email, senha)
  });

  it('Realiza login e cadastra uma despesa e uma receita', () => {
    cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/authorization/login`).as('loginReq')

    // Faz login
    cy.login(false, email, senha)

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/')

    cy.exeLaunch()

    // cy.get('[data-cy=descricao]').type('Compra no mercado');
    // cy.get('[data-cy=valor]').type('150.00');
    // cy.get('[data-cy=data]').type('2025-06-01');
    // cy.get('[data-cy=btn-salvar]').click();

    // cy.contains('Despesa cadastrada com sucesso').should('be.visible');

    // // ---- Cadastrar RECEITA ----
    // cy.get('[data-cy=btn-cadastrar-receita]').click();

    // cy.get('[data-cy=descricao]').type('Salário');
    // cy.get('[data-cy=valor]').type('3500.00');
    // cy.get('[data-cy=data]').type('2025-06-01');
    // cy.get('[data-cy=btn-salvar]').click();

    // cy.contains('Receita cadastrada com sucesso').should('be.visible');
  });
});
