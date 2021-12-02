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

    cy.apiroute('GET', `${taxonomyApi}/nodes?language=nb&nodeType=SUBJECT`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/nodes/${selectSubject}/nodes?language=nb&recursive=true`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.intercept('GET', '/draft-api/v1/user-data', {
      userId: 'user_id',
      latestEditedArticles: ['400', '800'],
    });

    cy.intercept('GET', '/draft-api/v1/drafts/*', 'draft-533');

    cy.visit(`/structure/${selectSubject}`);
    cy.apiwait(['@allSubjects', '@allSubjectTopics']);
  });

  beforeEach(() => {
    setToken();
  });

  it('should add a new subject', () => {
    cy.intercept('POST', `${taxonomyApi}/nodes`, []).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/translations`, []).as(
      'subjectTranslations',
    );
    cy.apiroute('PUT', `${taxonomyApi}/nodes/${selectSubject}/metadata`, 'invisibleMetadata');
    cy.intercept('GET', `${taxonomyApi}/nodes?language=nb`, []).as('allTopics');
    cy.get('[data-cy=settings-button]')
      .first()
      .click();
    cy.get('[data-testid=changeNodeNameButton]').click();
    cy.get('[data-testid=saveNodeTranslationsButton]').should('be.disabled');
    cy.get('[data-testid=addNodeNameTranslation]').type('TEST{enter}');
    cy.intercept('PUT', `${taxonomyApi}/nodes/urn:subject:20/translations/nb`, '').as(
      'newSubjectName',
    );
    cy.intercept('GET', `${taxonomyApi}/nodes?language=nb&nodeType=SUBJECT`, 'updatedSubjects').as(
      'updatedSubjects',
    );
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/translations`, [
      { name: 'NDLA filmTEST', language: 'nb' },
    ]).as('updatedTranslations');
    cy.get('[data-testid=saveNodeTranslationsButton]')
      .should('be.enabled')
      .first()
      .click();

    cy.apiwait(['@newSubjectName']);
    cy.apiwait(['@updatedTranslations']);
    cy.get('[data-testid=saveNodeTranslationsButton]').contains('Lagret');

    cy.intercept('DELETE', `${taxonomyApi}/nodes/${selectSubject}/translations/nb`, []).as(
      'deleteSubjectTranslation',
    );
    cy.get('[data-testid=subjectName_nb_delete]')
      .first()
      .click();

    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/translations`, []).as(
      'translations',
    );
    cy.intercept('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects').as('allSubjects');

    cy.get('[data-testid=saveNodeTranslationsButton]')
      .first()
      .click();
    cy.apiwait('@deleteSubjectTranslation', '@allSubjects', '@translations');
    cy.get('[data-testid=saveNodeTranslationsButton]').contains('Lagret');

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
