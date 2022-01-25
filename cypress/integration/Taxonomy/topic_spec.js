/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import phrases from '../../../src/phrases/phrases-nb';

const selectSubject = 'urn:subject:20';
const selectTopic = 'urn:topic:1:186732';

describe('Topic editing', () => {
  beforeEach(() => {
    cy.setToken();

    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/subjects/${selectSubject}/topics?recursive=true&language=nb`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', `${taxonomyApi}/topics?*language=nb`, 'allTopics');
    cy.apiroute('GET', `${taxonomyApi}/resource-types/?language=nb`, 'resourceTypes');
    cy.apiroute('GET', `**/draft-api/v1/drafts/**`, 'article');

    cy.intercept('POST', `${taxonomyApi}/topics`, []);
    cy.apiroute('GET', `${taxonomyApi}/topics/${selectTopic}/connections`, 'topicConnections');
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.intercept('GET', `${taxonomyApi}/topics/${selectTopic}/resources/?language=nb`, []);
    cy.intercept('GET', '/draft-api/v1/user-data', {"userId":"user_id","latestEditedArticles":["400","800"]});

    cy.visit(`/structure/${selectSubject}/${selectTopic}`);
    cy.apiwait(['@allSubjects', '@allSubjectTopics']);
    cy.get('[data-cy=settings-button-topic]').should('be.visible');
  });

  it('should have a settings menu where everything works', () => {
    cy.apiroute('PUT', `${taxonomyApi}/topics/${selectTopic}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.metadata.changeVisibility)
      .click();
    cy.get('input[id="visible"]').click({force: true});
    cy.wait(['@invisibleMetadata', '@article']);
  });
});
