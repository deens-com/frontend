import moment from 'moment';

describe('Should go to trip organizer', function() {
  before(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/search?include=owner',
      response: {
        trips: [],
      },
    });
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('From homepage', function() {
    cy.contains('Create a trip from scratch').click();
    cy.url().should('include', '/trips/organize');
    cy.getTestElement('tripNameInput').should('have.value', 'New Trip');
    cy.findTestElement('day').should('have.length', 1);
    cy.getTestElement('noServicesText').should('exist');

    cy.getTestElement('checkoutBoxDate').within(checkoutBoxDate => {
      cy.root()
        .find('input')
        .should('have.length', 2);
      cy.log(
        moment()
          .add('days', 1)
          .format('MM/DD/YY'),
      );
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
});
