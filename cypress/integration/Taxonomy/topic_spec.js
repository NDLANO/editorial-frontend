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
const selectTopic = 'urn:topic:1:186732';

describe('Topic editing', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', `${taxonomyApi}/nodes?language=nb&nodeType=SUBJECT`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/nodes/${selectSubject}/nodes?language=nb&recursive=true`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', `${taxonomyApi}/resource-types/?language=nb`, 'resourceTypes');
    cy.apiroute('GET', `**/draft-api/v1/drafts/**`, 'article');

    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.intercept('GET', `${taxonomyApi}/nodes/${selectTopic}/resources?language=nb`, []);
    cy.intercept('GET', '/draft-api/v1/user-data', {
      userId: 'user_id',
      latestEditedArticles: ['400', '800'],
    });

    cy.visit(`/structure/${selectSubject}/${selectTopic}`);
  });

  it('should have a settings menu where everything works', () => {
    cy.apiwait('@allSubjectTopics');
    cy.apiroute('PUT', `${taxonomyApi}/nodes/${selectTopic}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button]').click();
    cy.get('button')
      .contains(phrases.metadata.changeVisibility)
      .click();
    cy.get('input[id="visible"]').click({ force: true });
    cy.wait('@invisibleMetadata');
  });
});
