import moment from 'moment';

Cypress.Commands.add('getTestElement', selector => {
  return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('findTestElement', selector => {
  return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('login', () => {
  cy.fixture('users/login-success').then(user => {
    localStorage.setItem(`please-${Cypress.env('NODE_ENV')}-session`, JSON.stringify(user));
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem(`please-${Cypress.env('NODE_ENV')}-session`);
});

Cypress.Commands.add('checkTripOrganizerIsEmpty', () => {
  cy.getTestElement('tripNameInput').should('have.value', 'New Trip');
  cy.findTestElement('day').should('have.length', 1);
  cy.getTestElement('noServicesText').should('exist');

  cy.getTestElement('checkoutBoxDate').within(checkoutBoxDate => {
    cy.root()
      .find('input')
      .should('have.length', 2);

    cy.root()
      .get('input:enabled')
      .should(
        'have.value',
        moment()
          .add('days', 1)
          .format('MM/DD/YY'),
      );
    cy.root()
      .get('input:disabled')
      .should(
        'have.value',
        moment()
          .add('days', 2)
          .format('MM/DD/YY'),
      );
  });
});
