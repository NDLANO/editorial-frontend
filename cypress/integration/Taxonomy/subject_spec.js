/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Subject editing', () => {
  before(() => {
    setToken();

    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true&language=nb',
      'allSubjectTopics',
    );
    cy.apiroute('GET', '/taxonomy/v1/subjects/urn:subject:12/filters', 'allSubjectFilters');

    cy.visit('/structure/urn:subject:12', visitOptions);
    cy.wait(['@allSubjects', '@allSubjectTopics', '@allSubjectFilters']);
  });

  beforeEach(() => {
    setToken();
  });

  it('should add a new subject', () => {
    cy.intercept('POST', '/taxonomy/v1/subjects', []).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.intercept('PUT', `/taxonomy/v1/subjects/urn:subject:12`, []).as('newSubjectName');
    cy.intercept('POST', '/taxonomy/v1/topics', []).as('addNewTopic');
    cy.intercept('POST', '/taxonomy/v1/filters', []).as('addFilter');
    cy.intercept('PUT', '**/taxonomy/v1/filters/*', []).as('editFilter');
    cy.intercept('DELETE', '**/taxonomy/v1/filters/*', []).as('deleteFilter');
    cy.apiroute('GET', '/taxonomy/v1/topics?language=nb', 'allTopics');
    cy.intercept('POST', '/taxonomy/v1/topic-filters',[]);
    cy.intercept('POST', '/taxonomy/v1/subject-topics', []).as('addNewSubjectTopic');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.wait('@allTopics')
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@newSubjectName');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.get('[data-testid=editSubjectFiltersButton]').click();
    cy.get('[data-testid=addFilterButton]').click();
    cy.get('[data-testid=addFilterInput]').type('cypress-test-filter{enter}');
    cy.wait('@addFilter');

    cy.get('[data-testid=editFilterBox] > div')
      .find('button')
      .first()
      .click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@editFilter');
    cy.get('[data-testid=deleteFilter]')
      .first()
      .click();
    cy.get('[data-testid=warningModalConfirm]').click();
    cy.wait('@deleteFilter');
  });
});
