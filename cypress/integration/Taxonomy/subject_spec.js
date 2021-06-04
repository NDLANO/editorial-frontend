/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support';
import phrases from '../../../src/phrases/phrases-nb';

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

    cy.visit(`/structure/${selectSubject}`);
    cy.apiwait(['@allSubjects', '@allSubjectTopics']);
  });

  beforeEach(() => {
    setToken();
  });

  it('should add a new subject', () => {
    cy.intercept('POST', `${taxonomyApi}/subjects`, []).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.intercept('PUT', `${taxonomyApi}/subjects/${selectSubject}`, []).as('newSubjectName');
    cy.intercept('POST', `${taxonomyApi}/topics`, []).as('addNewTopic');
    cy.intercept('GET', `${taxonomyApi}/topics?language=nb`, 'allTopics').as('allTopics');
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}`, 'selectSubject');
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}/topics*`, 'allSubjectTopics');
    cy.intercept('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute('PUT', `${taxonomyApi}/subjects/${selectSubject}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.wait('@allTopics');
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@newSubjectName');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.get('button')
      .contains(phrases.metadata.changeVisibility)
      .click();
    cy.get('input[id="visible"]').click({force: true});
    cy.wait('@invisibleMetadata');
  });
});
