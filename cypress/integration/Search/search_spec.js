/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Search', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute('GET', '/taxonomy/v1/subjects/?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?page=1&page-size=10&query=&sort=-relevance',
      'search',
    );
    cy.visit(
      '/search/content?page=1&page-size=10&sort=-relevance',
      visitOptions,
    );
    cy.apiwait('@resourceTypes', '@search', '@allSubjects');
  });

  it('Can use all dropdowns and text input', () => {
    cy.get('input[name="query"]').type('Test');
  });
});
