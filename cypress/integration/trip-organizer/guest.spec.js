import moment from 'moment';
import guestTrip from './trip-guest.json';
import loginSuccess from './login-success.json';
import usersMe from './users-me.json';
import tripCreated from './trip-created.json';
import tripResponse from './trip-response.json';
import guestAvailability from './trip-guest-availability-response.json';
import availability from './trip-availability-response.json';

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
  before(() => {
    window.localStorage.setItem(
      `please-${Cypress.env('NODE_ENV')}-anonymous-trip`,
      JSON.stringify(guestTrip),
    );
  });

  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/trips/anonymous-availability',
      response: guestAvailability,
    });

    cy.route({
      method: 'GET',
      url: '/trips/5c58f13210dfca8453fb1a5b?include=services,tags,reservations',
      response: tripResponse,
    });

    cy.route({
      method: 'GET',
      url: '/trips/5c58f13210dfca8453fb1a5b/availability?**',
      response: availability,
    });

    cy.route({
      method: 'POST',
      url: '/trips',
      response: tripCreated,
    });

    cy.route({
      method: 'POST',
      url: '/users/login',
      response: loginSuccess,
    });

    cy.route({
      method: 'GET',
      url: '/users/me',
      response: usersMe,
    });

    cy.visit(`/trips/organize`);
  });

  after(() => {
    window.localStorage.removeItem(`please-${Cypress.env('NODE_ENV')}-anonymous-trip`);
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
