/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';

describe('Film editing', () => {
  before(() => {
    setToken();
    cy.apiroute('GET', '**/frontpage-api/v1/filmfrontpage', 'filmFrontpage');
    cy.apiroute('GET', '**/search-api/v1/search/*', 'allMovies');
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/film');
    cy.apiwait(['@filmFrontpage', '@allMovies', '@zendeskToken']);
  });

  it('Can add a movie to the slideshow', () => {
    cy.get(`input[placeholder="Legg til film i slideshow"]`)
      .click()
      .type('Page One')
      .parent()
      .parent()
      .parent()
      .parent()
      .contains('Page One')
      .click()
      .wait('@allMovies');
  });

  it('Can remove movie from slideshow', () => {
    cy.get('ul > li > div')
      .contains('Page One')
      .parent()
      .parent()
      .find('button')
      .eq(-1)
      .click();
  });

  it('Can add theme', () => {
    cy.apiroute('GET', '**/search-api/v1/search/*', 'allMovies');
    cy.get('[data-cy=add-theme-modal]')
      .click()
      .get(`input[placeholder="Skriv navn på Bokmål"]`)
      .type('Ny testgruppe')
      .get('button')
      .contains('Opprett gruppe')
      .click();
    cy.wait('@allMovies')
  });
});
