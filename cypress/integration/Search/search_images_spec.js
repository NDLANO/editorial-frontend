/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Search images', () => {
  beforeEach(() => {
    cy.setToken();
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/image-api/v2/images/?page=1&page-size=10&sort=-relevance',
      'searchImages',
    );
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/image?page=1&page-size=10&sort=-relevance');
    cy.apiwait(['@licenses', '@searchImages', '@allSubjects', '@zendeskToken']);
  });

  it('Can use text input', () => {
    cy.apiroute(
      'GET',
      '/image-api/v2/images/?page=1&page-size=10&query=Test&sort=-relevance',
      'searchImagesQuery',
    );
    cy.get('input[name="query"]')
      .type('Test')
      .blur();
    cy.apiwait('@searchImagesQuery');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('input[name="query"]').clear();
    cy.apiwait('@searchImages');
  });

  it('Can use language dropdown', () => {
    cy.apiroute(
      'GET',
      '/image-api/v2/images/?language=en&page=1&page-size=10&sort=-relevance',
      'searchImagesLang',
    );
    cy.get('select[name="language"]')
      .select('Engelsk')
      .blur();
    cy.apiwait('@searchImagesLang');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="language"]').select('Velg språk');
    cy.apiwait('@searchImages');
  });
});
