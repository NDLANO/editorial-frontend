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
    cy.apiroute('GET', '/taxonomy/v1/subjects?includeMetadata=true&language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?includeMetadata=true&recursive=true',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/filters',
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
      'filters=urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554',
    );
  });
});
