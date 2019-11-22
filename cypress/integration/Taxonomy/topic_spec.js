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
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:core`,
      'coreResources',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:supplementary`,
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
    cy.apirouteTaxonomy({
      method: 'POST',
      status: 201,
      url: '/taxonomy/v1/topic-filters',
      headers: {
        Location: 'newFilterPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
      alias: 'addFilter',
    });
    cy.apiroute('GET', '/taxonomy/v1/topics/?language=nb', 'allTopics');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/filters`,
      'topicFilters',
    );

    cy.apirouteTaxonomy({
      method: 'PUT',
      url: '/taxonomy/v1/topic-filters/**',
      headers: {
        Location: 'filterLocation',
        'content-type': 'text/plain; charset=UTF-8',
      },
      status: 201,
      response: '',
      alias: 'changeFilter',
    });
    cy.route({
      method: 'DELETE',
      url: '/taxonomy/v1/topic-filters/**',
      status: 204,
      response: '',
    }).as('deleteFilter');

    cy.visit(`/structure/${selectSubject}/${selectTopic}`, visitOptions);
  });

  it('should have a settings menu where everything works', () => {
    cy.wait('@allSubjectTopics');

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.get('[data-testid=toggleRelevance]').click({ multiple: true });

    cy.get('[data-testid="submitConnectFilters"]').click();
    cy.apiwait(['@changeFilter', '@allSubjectTopics']);

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.wait('@allSubjectTopics');
    cy.get('[data-testid=connectFilterItem]').click({ multiple: true });
    cy.get('[data-testid="submitConnectFilters"]').click();
    cy.apiwait(['@addFilter', '@deleteFilter', '@allSubjectTopics']);

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
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
