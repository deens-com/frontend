const tripId = '5c58f13210dfca8453fb1a5b';

describe('Should be able to book', function() {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/trips/anonymous-availability', 'fx:trips/guest-availability');
    cy.route('GET', `/trips/${tripId}?include=services,tags,reservations`, 'fx:trips/get-includes');
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/availability').as(
      'availabilityCheck',
    );
    cy.route('POST', '/trips', 'fx:trips/created');
    cy.route('POST', '/users/login', 'fx:users/login-success');
    cy.route('GET', '/users/me', 'fx:users/me');
    cy.route('PATCH', `/trips/${tripId}`, 'fx:trips/created');
  });

  it('Logged in user should go to checkout page if all services are available', function() {
    cy.login();
    cy.visit('/trips/organize');
    cy.wait('@availabilityCheck');
    cy.getTestElement('serviceAvailable').should('have.length', 3);
    cy.getTestElement('checkoutBookButton').click();
    cy.url().should('include', `/trips/checkout/${tripId}`);
  });

  it('Logged in user should view a popup before going to checkout page if not all services available', function() {
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/unavailability').as(
      'availabilityCheck',
    );
    cy.login();
    cy.visit('/trips/organize');
    cy.wait('@availabilityCheck');
    cy.getTestElement('serviceAvailable').should('have.length', 2);
    cy.getTestElement('checkoutBookButton').click();
    cy.getTestElement('popupWillDeleteServices').should('exist');
    cy.contains('Remove services and book trip').click();

    // this is to have only available services in the trip
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/availability').as(
      'availabilityCheck',
    );
    cy.url().should('include', '/checkout');
  });
});
