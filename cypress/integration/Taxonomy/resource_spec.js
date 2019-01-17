/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';
import coreResources from '../../fixtures/coreResources.json';

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
    '/taxonomy/v1/topics/urn:topic:1:183437/resources/?language=nb&relevance=urn:relevance:core&filter=',
    'fixture:coreResources.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/topics/urn:topic:1:183437/resources/?language=nb&relevance=urn:relevance:supplementary&filter=',
    'fixture:suppResources.json',
  );
  cy.route('GET', '/article-api/v2/articles/8785', 'fixture:article.json');
  cy.route(
    'GET',
    '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=&content-type=topic-article',
    'fixture:getArticles.json',
  ).as('getArticles');
  cy.route('PUT', '/taxonomy/v1/topics/urn:topic:1:183437', '').as(
    'updateTopicDesc',
  );
  beforeEachHelper('/structure/urn:subject:12');
});

describe('Resource listing', () => {
  it('shows all the different resource types, and can add/delete them', () => {
    cy.get('[data-testid=resource-type-subject]').should('have.length', 0);
    cy.get('button[id="urn:subject:12/urn:topic:1:183043"]').click();
    cy.get('button[id="urn:topic:1:183043/urn:topic:1:183437"]').click();
    cy.get('[data-testid=resource-type-subject-material]').should(
      'have.length',
      14,
    );
    cy.get('[data-testid=resource-type-tasks-and-activities]').should(
      'have.length',
      3,
    );
    cy.get('[data-testid=changeTopicDescription]').click();

    cy.get('[data-testid="dropdown-items"] > div[role=option]')
      .first()
      .click();
    cy.wait('@updateTopicDesc');
  });
  it.only('should open filter picker and have functioning buttons', () => {
    cy.route(
      'GET',
      '/taxonomy/v1/resources/urn:resource:1:167841/filters?language=nb',
      'fixture:resourceFilters.json',
    );

    cy.get('button[id="urn:subject:12/urn:topic:1:183043"]').click();
    cy.get('button[id="urn:topic:1:183043/urn:topic:1:183437"]').click();
    cy.get(`[data-testid="openFilterPicker-${coreResources[0].id}"]`).click();
    cy.get(
      '[data-testid="useFilterCheckbox-urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce"]',
    ).click();
    cy.get(
      '[data-testid="selectCoreRelevance-urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce"]',
    ).click();
  });
});
