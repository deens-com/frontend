const tripId = '5c58f13210dfca8453fb1a5b';
const bookedTripId = '5c58f13210dfca8453fb1a5c';

describe('Should be redirected from /trips/organize', function() {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/trips/anonymous-availability', 'fx:trips/guest-availability');
    cy.route('GET', `/trips/${tripId}?include=services,tags,reservations`, 'fx:trips/get-includes');
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/availability');
    cy.route('POST', '/trips', 'fx:trips/created').as('tripCreated');
    cy.route('POST', '/users/login', 'fx:users/login-success');
    cy.route('GET', '/users/me', 'fx:users/me');
  });

  it('User logged in and trip not saved', function() {
    cy.login();
    cy.visit(`/trips/organize`);
    cy.wait('@tripCreated').then(({ request }) => {
      expect(request.body.services).to.be.empty;
    });
    cy.url().should('include', `/trips/organize/${tripId}`);
  });

  it('User logged in and trip saved', function() {
    cy.fixture('trips/guest').then(guestTrip => {
      localStorage.setItem(
        `deens-${Cypress.env('NODE_ENV')}-anonymous-trip`,
        JSON.stringify(guestTrip),
      );
    });
    cy.login();
    cy.visit(`/trips/organize`);
    cy.wait('@tripCreated').then(({ request }) => {
      expect(request.body.services).to.have.length.of(3);
    });
    cy.url().should('include', `/trips/organize/${tripId}`);
  });

  it('User not logged in and trip not saved', function() {
    cy.visit('/trips/organize');
    cy.checkTripOrganizerIsEmpty();
  });

  it('User not logged in and has a trip saved', function() {
    cy.fixture('trips/guest').then(guestTrip => {
      localStorage.setItem(
        `deens-${Cypress.env('NODE_ENV')}-anonymous-trip`,
        JSON.stringify(guestTrip),
      );
    });
    cy.visit('/trips/organize');
    cy.findTestElement('day').should('have.length', 3);
  });
});

describe('Should be redirected from /trips/organize/:id', function() {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/trips/anonymous-availability', 'fx:trips/guest-availability');
    cy.route('GET', `/trips/${tripId}?include=services,tags,reservations`, 'fx:trips/get-includes');
    cy.route('GET', `/trips/${tripId}/availability?**`, 'fx:trips/availability');
    cy.route(
      'GET',
      `/trips/${bookedTripId}?include=services,tags,reservations`,
      'fx:trips/get-includes-booked',
    );
    cy.route('POST', '/trips', 'fx:trips/created');
    cy.route('POST', '/users/login', 'fx:users/login-success');
    cy.route('GET', '/users/me', 'fx:users/me');
  });

  it('User not logged in', function() {
    cy.visit(`/trips/organize/${tripId}`);
    cy.url().should('include', `/register`);
  });

  it('User is owner and trip is booked', function() {
    cy.login();
    cy.visit(`/trips/organize/${bookedTripId}`);
    cy.url().should('include', `_${bookedTripId}`);
  });

  it('User is not owner and trip is not booked', function() {
    cy.route('GET', '/users/me', 'fx:users/another-user');
    cy.login();
    cy.visit(`/trips/organize/${tripId}`);
    cy.url().should('equals', `${Cypress.config().baseUrl}/`);
  });

  it('User is owner and trip is not booked', function() {
    cy.login();
    cy.visit(`/trips/organize/${tripId}`);
    cy.findTestElement('day').should('have.length', 3);
  });
});
