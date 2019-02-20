const tripId = '5c58f13210dfca8453fb1a5b';

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
    cy.getTestElement('createTripHeaderButton').click();
    cy.url().should('include', '/trips/organize');
    cy.checkTripOrganizerIsEmpty();
  });
});

describe('Should login to book the trip', function() {
  beforeEach(() => {
    cy.fixture('trips/guest').then(guestTrip => {
      localStorage.setItem(
        `please-${Cypress.env('NODE_ENV')}-anonymous-trip`,
        JSON.stringify(guestTrip),
      );
    });

    cy.server();
    cy.route('GET', '/trips/anonymous-availability', 'fx:trips/guest-availability');
    cy.route('GET', `/trips/${tripId}?include=services,tags,reservations`, 'fx:trips/get-includes');
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/availability');
    cy.route('POST', '/trips', 'fx:trips/created');
    cy.route('PATCH', '/trips', 'fx:trips/created');
    cy.route('POST', '/users/login', 'fx:users/login-success');
    cy.route('GET', '/users/me', 'fx:users/me');

    cy.visit(`/trips/organize`);
  });

  afterEach(() => {
    localStorage.removeItem(`please-${Cypress.env('NODE_ENV')}-anonymous-trip`);
  });

  it('Should be redirected to register page', function() {
    cy.findTestElement('day').should('have.length', 3);

    cy.getTestElement('checkoutBookButton').click();
    cy.url().should('include', '/register');

    cy.contains('Please login or register to continue');
  });

  it('Should create the trip after login and be redirected to checkout page', function() {
    cy.getTestElement('checkoutBookButton').click();

    cy.contains('Sign In').click();
    cy.getTestElement('loginEmail').within(_ => {
      cy.root()
        .get('input')
        .type('email@please.com');
    });

    cy.getTestElement('loginPassword').within(_ => {
      cy.root()
        .get('input')
        .type('password');
    });

    cy.getTestElement('loginSubmit').click();

    cy.url().should('include', '/checkout');

    cy.contains('Total Price Booked Items');
  });
});
