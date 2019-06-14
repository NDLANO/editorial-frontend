/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Slideshow editing', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '**/frontpage-api/v1/filmfrontpage', 'filmFrontpage');
    cy.apiroute('GET', '**/search-api/v1/search/**', 'allMovies');
    cy.visit('/film', visitOptions);
    cy.apiwait('@filmFrontpage');
    cy.apiwait('@allMovies');
    cy.route('POST', '**/filmfrontpage/', {});
  });

  it('Can add a movie to the slideshow', () => {
    cy.get('[data-cy=add-slideshow-movie]').select('Bawke');
  });

  it('Can remove movie from slideshow', () => {
    cy.get('ul > li > div')
      .contains('Bonki')
      .parent()
      .find('button')
      .eq(-1)
      .click();
  });

  it('Can add theme', () => {
    cy.get('[data-cy=add-theme-modal]')
      .click()
      .get(`input[placeholder="Skriv navn på Bokmål"]`)
      .type('Ny testgruppe')
      .get('button')
      .contains('Opprett gruppe')
      .click();
  });
});
