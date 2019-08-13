/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import phrases from '../../../src/phrases/phrases-nb';

const selectSubject = 'urn:subject:12';
const selectTopic = 'urn:topic:1:183043';

describe('Topic editing', () => {
  beforeEach(() => {
    setToken();
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return (
          xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
        );
      },
    });
    cy.apiroute('GET', '/taxonomy/v1/subjects/?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/subjects/${selectSubject}/topics?recursive=true`,
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/subjects/${selectSubject}/filters`,
      'allSubjectFilters',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:core&filter=`,
      'coreResources',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:supplementary&filter=`,
      'suppResources',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/**', 'article');

    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topics',
      status: 201,
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    });
    cy.route({
      method: 'POST',
      status: 201,
      url: '/taxonomy/v1/topic-subtopics',
      headers: {
        Location: 'newSubTopicPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    });
    cy.apiroute('GET', '/taxonomy/v1/topics/?language=nb', 'allTopics');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/filters`,
      'topicFilters',
    );
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topic-filters',
      headers: {
        Location: 'filterLocation',
        'content-type': 'text/plain; charset=UTF-8',
      },
      status: 201,
      response: '',
    }).as('addToFilter');

    cy.visit(`/structure/${selectSubject}/${selectTopic}`, visitOptions);
  });

  it.only('should have a settings menu where everything works', () => {
    cy.wait('@allSubjectTopics');

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.addExistingTopic)
      .click();
    cy.get(`input[placeholder="${phrases.taxonomy.existingTopic}"]`).type('F');
    cy.wait('@allTopics');
    cy.get('[data-testid=dropdown-items]')
      .contains('Filmanalyse')
      .click();

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.get('[data-cy=connectFilterItem] > label').each($lbl => {
      cy.wrap($lbl).click();
    });

    cy.get('[data-testid="submitConnectFilters"]').click();

    cy.wait('@addToFilter');
    cy.route({
      method: 'DELETE',
      url:
        '/taxonomy/v1/topic-filters/urn:topic-filter:e979cfb2-29de-402b-bd24-f8de5f14cfe1',
      status: 204,
      response: '',
    });
    cy.get('button')
      .contains(phrases.alertModal.delete)
      .click();
    cy.route({
      method: 'DELETE',
      url:
        '/taxonomy/v1/subject-topics/urn:subject-topic:2357d45d-1f79-4953-86e8-b97617a493d0',
      status: 204,
      response: '',
    });
    cy.get('[data-testid=confirmDelete]').click({
      force: true,
    });
  });
});
