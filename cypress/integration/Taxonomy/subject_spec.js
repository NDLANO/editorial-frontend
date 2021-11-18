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
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.intercept('GET', '/draft-api/v1/user-data', {
      userId: 'user_id',
      latestEditedArticles: ['400', '800'],
    });

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
    cy.intercept('POST', `${taxonomyApi}/topics`, []).as('addNewTopic');
    cy.intercept('GET', `${taxonomyApi}/topics?language=nb`, 'allTopics').as('allTopics');
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}`, 'selectSubject');
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}/translations`, []).as(
      'subjectTranslations',
    );
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}/topics*`, 'allSubjectTopics');
    cy.intercept('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.intercept('DELETE', `${taxonomyApi}/subjects/${selectSubject}/translations/nb`, []).as(
      'deleteSubjectTranslation',
    );
    cy.apiroute('PUT', `${taxonomyApi}/subjects/${selectSubject}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.intercept('PUT', `${taxonomyApi}/subjects/${selectSubject}/translations/nb`).as(
      'newSubjectName',
    );
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=addSubjectNameTranslation]').type('TEST{enter}');
    cy.intercept('GET', `${taxonomyApi}/subjects?language=nb`, 'updatedSubjects').as(
      'updatedSubjects',
    );
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}/translations`, [
      { name: 'NDLA filmTEST', language: 'nb' },
    ]).as('updatedTranslations');
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}`, 'updatedSelectSubject').as(
      'updatedSelectSubject',
    );
    cy.get('[data-testid=saveSubjectTranslationsButton]')
      .first()
      .click();
    cy.apiwait(
      '@newSubjectName',
      '@updatedSelectSubject',
      '@updatedSubjects',
      '@updatedTranslations',
    );
    cy.get('[data-testid=subjectName_nb_delete]')
      .first()
      .click();
    cy.get('[data-testid=saveSubjectTranslationsButton]')
      .first()
      .click();
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}/translations`, []).as(
      'translations',
    );
    cy.intercept('GET', `${taxonomyApi}/subjects/${selectSubject}`, 'selectSubject').as(
      'selectSubject',
    );
    cy.intercept('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects').as('allSubjects');
    cy.apiwait('@deleteSubjectTranslation', '@selectSubject', '@allSubjects', '@translations');
    cy.get('[data-testid=saveSubjectTranslationsButton]').contains('Lagret');

    cy.get('[data-cy=close-modal-button]')
      .first()
      .click();

    cy.get('button')
      .contains(phrases.metadata.changeVisibility)
      .click();
    cy.get('input[id="visible"]').click({ force: true });
    cy.wait('@invisibleMetadata');
  });
});
