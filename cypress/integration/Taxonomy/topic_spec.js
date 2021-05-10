/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';
import phrases from '../../../src/phrases/phrases-nb';

const selectSubject = 'urn:subject:12';
const selectTopic = 'urn:topic:1:183043';

describe('Topic editing', () => {
  beforeEach(() => {
    setToken();

    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/subjects/${selectSubject}/topics?recursive=true&language=nb`,
      'allSubjectTopics',
    );
    cy.apiroute('GET', `/taxonomy/v1/topics?recursive=true&language=nb`, 'allTopics');
    cy.apiroute('GET', `/taxonomy/v1/subjects/${selectSubject}/filters`, 'allSubjectFilters');
    cy.apiroute('GET', '/taxonomy/v1/filters/?language=nb', 'allFilters');
    cy.apiroute('GET', '/taxonomy/v1/resource-types/?language=nb', 'resourceTypes');
    cy.apiroute('GET', '**/draft-api/v1/drafts/**', 'article');

    cy.intercept('POST', '/taxonomy/v1/topics', []);
    cy.intercept('POST', '/taxonomy/v1/topic-filters', []).as('addFilter');
    cy.apiroute('GET', `/taxonomy/v1/topics/${selectTopic}/filters`, 'topicFilters');

    cy.intercept('PUT', '**/taxonomy/v1/topic-filters/**', []);
    cy.visit(`/structure/${selectSubject}/${selectTopic}`);
  });

  it('should have a settings menu where everything works', () => {
    cy.wait('@allSubjectTopics');
    cy.wait('@allFilters');

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.wait('@allSubjectTopics');
    cy.get('[data-testid=toggleRelevance]').click({ multiple: true });

    cy.get('[data-testid="submitConnectFilters"]').click();
    cy.apiwait(['@allSubjectTopics']);

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.wait('@allSubjectTopics');
    cy.get('[data-testid=connectFilterItem]').click({ multiple: true });
    cy.get('[data-testid="submitConnectFilters"]').click();
    cy.apiwait(['@addFilter']);
  });
});
