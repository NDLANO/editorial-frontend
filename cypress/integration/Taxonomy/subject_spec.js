/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support';

const selectSubject = 'urn:subject:20';

describe('Subject editing', () => {
  before(() => {
    setToken();

    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/subjects/${selectSubject}/topics?recursive=true&language=nb`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', `${taxonomyApi}/subjects/${selectSubject}/filters`, 'allSubjectFilters');

    cy.visit(`/structure/${selectSubject}`);
    cy.apiwait(['@allSubjects', '@allSubjectTopics', '@allSubjectFilters']);
  });

  beforeEach(() => {
    setToken();
  });

  it('should add a new subject', () => {
    cy.intercept('POST', `${taxonomyApi}/subjects`, []).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.apiwait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.intercept('PUT', `${taxonomyApi}/subjects/${selectSubject}`, []).as('newSubjectName');
    cy.intercept('POST', `${taxonomyApi}/topics`, []).as('addNewTopic');
    cy.intercept('POST', `${taxonomyApi}/filters`, []).as('addFilter');
    cy.intercept('PUT', `${taxonomyApi}/filters/*`, []).as('editFilter');
    cy.intercept('DELETE', `${taxonomyApi}/filters/*`, []).as('deleteFilter');
    cy.apiroute('GET', `${taxonomyApi}/topics?language=nb`, 'allTopics');
    cy.intercept('POST', `${taxonomyApi}/topic-filters`,[]);
    cy.intercept('POST', `${taxonomyApi}/subject-topics`, []).as('addNewSubjectTopic');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.apiwait('@allTopics')
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.apiwait('@newSubjectName');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.get('[data-testid=editSubjectFiltersButton]').click();
    cy.get('[data-testid=addFilterButton]').click();
    cy.get('[data-testid=addFilterInput]').type('cypress-test-filter{enter}');
    cy.apiwait('@addFilter');

    // cy.get('[data-testid=editFilterBox] > div')
    //   .find('button')
    //   .first()
    //   .click();
    // cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    // cy.wait('@editFilter');
    // cy.get('[data-testid=editFilterBox] > div')
    //   .first()
    //   .find('[data-testid=deleteFilter]')
    //   .click();
    // cy.wait(500);
    // cy.get('[data-testid=warningModalConfirm]').click();
    // cy.wait('@deleteFilter');
  });
});
