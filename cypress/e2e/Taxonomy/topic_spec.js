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
      `/draft-api/v1/drafts/ids/?fallback=true&ids=19237%2C19238%2C19315%2C19351%2C19385%2C19394%2C19395%2C19366%2C19398%2C19400%2C19381%2C9432%2C21583%2C19403%2C19405%2C20623%2C19409%2C19626%2C19553%2C24566%2C19420%2C19421%2C19462%2C19516%2C19532%2C19533%2C19658%2C22049%2C22050%2C19667%2C19673%2C19674%2C19675%2C14810%2C19678%2C19705&page=1&page-size=36`,
      'emptyDraftIds',
    );
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
