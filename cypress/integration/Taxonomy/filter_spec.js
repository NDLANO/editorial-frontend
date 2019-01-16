/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  cy.server({ force404: true });
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/?language=nb',
    'fixture:allSubjects.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true',
    'fixture:allSubjectTopics.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/filters',
    'fixture:allSubjectFilters.json',
  );
  beforeEachHelper('/structure/urn:subject:12');
});

describe('Subject editing', () => {
  it('should have a settings menu where everything works', () => {
    cy.get('[data-testid=filter-item]')
      .first()
      .click();
    cy.url().should(
      'contain',
      'filters=urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554',
    );
  });
});
