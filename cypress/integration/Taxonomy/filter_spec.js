/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Test filter functionality', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/taxonomy2/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy2/v1/subjects/urn:subject:12/topics?recursive=true&language=nb',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy2/v1/subjects/urn:subject:12/filters',
      'allSubjectFilters',
    );
    cy.visit('/structure/urn:subject:12', visitOptions);
    cy.apiwait('@allSubjects');
    cy.apiwait('@allSubjectTopics');
    cy.apiwait('@allSubjectFilters');
  });
  it('should filter subjects', () => {
    cy.get('[data-testid=filter-item]')
      .first()
      .click();
    cy.url().should(
      'contain',
      'filters=urn:filter:df8344b6-ad86-44be-b6b2-d61b3526ed29',
    );
  });
});
