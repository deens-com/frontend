import moment from 'moment';
import tripResponse from './trip-response.json';
import guestTrip from './trip-guest.json';

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

describe('Should login to book the trip', function() {
  const getTripUrl = `/trips/${tripResponse._id}?include=services,tags,reservations`;

  before(() => {
    //const trip = JSON.(tripResponse)
    /*cy.server()
    cy.route({
      method: 'GET',
      url: getTripUrl,
      response: tripResponse,
    })*/
    window.localStorage.setItem(
      `please-${Cypress.env('NODE_ENV')}-anonymous-trip`,
      JSON.stringify(guestTrip),
    );
  });

  beforeEach(() => {
    cy.visit(`/trips/organize`);
  });

  after(() => {
    window.localStorage.removeItem(`please-${Cypress.env('NODE_ENV')}-anonymous-trip`);
  });

  it('Get id', function() {
    cy.findTestElement('day').should('have.length', 3);

    cy.getTestElement('checkoutBookButton').click();
    cy.url().should('include', '/register');
  });
});
