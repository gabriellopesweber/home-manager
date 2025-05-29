Cypress.Commands.add('login', (email, senha) => {
  cy.get('input[name=email]').type(email);
  cy.get('input[name=senha]').type(senha, { log: false });
  cy.get('button[type=submit]').click();
});

Cypress.Commands.add('resetUsuario', (email, senha) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_API_URL')}/auth/login`,
    body: { email, senha },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      const token = response.body.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id || payload.sub;

      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('VITE_API_URL')}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false
      });
    }
  });
});
