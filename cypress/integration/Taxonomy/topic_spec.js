/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  cy.server({ force404: true });
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/?language=nb',
    'fixture:allSubjects.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true',
    'fixture:allSubjectTopics.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/filters',
    'fixture:allSubjectFilters.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/resource-types/?language=nb',
    'fixture:resourceTypes.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/topics/urn:topic:1:183043/resources/?language=nb&relevance=urn:relevance:core&filter=',
    'fixture:coreResources.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/topics/urn:topic:1:183043/resources/?language=nb&relevance=urn:relevance:supplementary&filter=',
    'fixture:supplementaryResources.json',
  );
  cy.route('GET', '/article-api/v2/articles/8497', 'fixture:article.json');
  beforeEachHelper('/structure/subject:12/topic:1:183043');
});

describe('Topic editing', () => {
  it('should have a settings menu where everything works', () => {
    cy.route({
      method: 'PUT',
      url: '/taxonomy/v1/topics/urn:topic:1:183043',
      status: 204,
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    }).as('changeTopicName');

    cy.get('[data-cy=settings-button-topic]').click({ force: true });
    cy.get('[data-cy=change-topic-name]').click({ force: true });
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}', {
      force: true,
    });
    cy.wait('@changeTopicName');
  });
});
