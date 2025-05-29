describe('Fluxo completo: cadastro e login', () => {
  const name = 'Usuario de teste';
  const email = 'skailaini@gmail.com';
  const senha = 'S123456';

  before(() => {
    cy.resetUsuario(email, senha);
  });

  it('deve cadastrar e fazer login com o mesmo usuário', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type(email);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="senha"]').type(senha);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');

    cy.login(email, senha);

    cy.url().should('include', '/dashboard');
  });
});
