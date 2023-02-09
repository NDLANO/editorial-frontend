/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support/e2e';
import phrases from '../../../src/phrases/phrases-nb';

const selectSubject = 'urn:subject:20';

describe('Subject editing', () => {
  before(() => {
    setToken();

    cy.apiroute('GET', `${taxonomyApi}/versions`, 'allVersions');
    cy.apiroute('GET', `${taxonomyApi}/nodes?isRoot=true&language=nb`, 'allSubjects');
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

    cy.visit(`/structure/${selectSubject}`);
    cy.apiwait(['@allVersions', '@allSubjects', '@allSubjectTopics']);
  });

  beforeEach(() => {
    setToken();
  });

  it('should add a new subject', () => {
    cy.intercept('POST', `${taxonomyApi}/nodes`, []).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.wait('@addSubject');
    // Since post request is mocked --> modal will not close automatically
    cy.get('[data-testid=taxonomyLightboxCloseButton]').click();
  });

  it('should have a settings menu where everything works', () => {
    cy.intercept('PUT', `${taxonomyApi}/nodes/${selectSubject}/translations/nb`, []).as(
      'newSubjectName',
    );
    cy.intercept('POST', `${taxonomyApi}/nodes`, []).as('addNewTopic');
    cy.intercept('GET', `${taxonomyApi}/nodes?language=nb`, 'allTopics').as('allTopics');
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/translations`, []).as(
      'subjectTranslations',
    );
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/nodes*`, 'allSubjectTopics');
    cy.intercept('GET', `${taxonomyApi}/nodes?isRoot=true&language=nb`, 'allSubjects').as(
      'allSubjects',
    );
    cy.intercept('DELETE', `${taxonomyApi}/nodes/${selectSubject}/translations/nb`, []).as(
      'deleteSubjectTranslation',
    );
    cy.apiroute('PUT', `${taxonomyApi}/nodes/${selectSubject}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button]')
      .first()
      .click();
    cy.get('[data-testid=changeNodeNameButton]').click();
    cy.wait('@subjectTranslations');
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectSubject}/translations`, [
      { name: 'NDLA filmTEST', language: 'nb' },
    ]).as('subjectTranslations');
    cy.get('[data-testid=addNodeNameTranslation]').type('TEST{enter}');
    cy.get('[data-testid=saveNodeTranslationsButton]')
      .first()
      .click();
    cy.wait(['@newSubjectName', '@subjectTranslations']);
    cy.get('[data-testid=saveNodeTranslationsButton]').contains('Lagret');

    cy.get('[data-testid=subjectName_nb_delete]')
      .first()
      .click();
    cy.get('[data-testid=saveNodeTranslationsButton]')
      .first()
      .click();
    cy.wait('@deleteSubjectTranslation');
    cy.get('[data-testid=saveNodeTranslationsButton]').contains('Lagret');

    cy.get('[data-cy=close-modal-button]')
      .first()
      .click();

    cy.get('button')
      .contains(phrases.metadata.changeVisibility)
      .click();
    cy.get('button[id="switch-visible"]').click({ force: true });
    cy.wait('@invisibleMetadata');
  });
});
