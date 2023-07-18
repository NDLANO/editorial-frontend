/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
const taxonomyApi = `/taxonomy/v1`;

const selectSubject = 'urn:subject:20';
const selectTopic = 'urn:topic:1:186732';

describe('Topic editing', () => {
  beforeEach(() => {
    setToken();

    cy.apiroute('GET', `${taxonomyApi}/versions`, 'allVersions');
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/ids/?fallback=true&ids=*`,
      'emptyDraftIds',
    );
    cy.apiroute('GET', `${taxonomyApi}/nodes?*`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/nodes/${selectSubject}/nodes?*`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.apiroute('GET', '/get_responsibles?*', 'getUsersResponsible');
    cy.intercept('GET', '/draft-api/v1/user-data', {
      userId: 'user_id',
      latestEditedArticles: ['400', '800'],
    });

    cy.visit(`/structure/${selectSubject}/${selectTopic}`);
    cy.apiwait(['@allVersions', '@allSubjects', '@allSubjectTopics']);
  });

  it('should have a settings menu where everything works', () => {
    cy.apiroute('PUT', `${taxonomyApi}/nodes/${selectTopic}/metadata`, 'invisibleMetadata');

    cy.get('[data-cy=settings-button]').click();
    cy.get('button').contains('Endre synlighet').click();
    cy.get('button[id="switch-visible"]').click({ force: true });
    cy.wait('@invisibleMetadata');
  });
});
