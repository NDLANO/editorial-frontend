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
  beforeEachHelper('/structure/subject:12');
});

describe('Resource listing', () => {
  it('shows all the different resource types, and can add/delete them', () => {
    cy.get('[data-testid=resource-type-subject]').should('have.length', 0);
    cy.get('[data-cy=subject-subFolders] > div a')
      .first()
      .click();
    cy.get('[data-cy=topic-subFolders] > div a')
      .first()
      .click();
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
  it('shows toggle relevance only when single filter is chosen', () => {
    cy.get('[data-cy=subject-subFolders] > div a')
      .first()
      .click();
    cy.get('[data-cy=topic-subFolders] > div a')
      .first()
      .click();
    cy.get('[data-testid="toggleRelevance-urn:resource:1:167841"]').should(
      'not.exist',
    );
    cy.get('[data-testid=filter-item]')
      .first()
      .click();
    cy.get('[data-testid="toggleRelevance-urn:resource:1:167841"]').should(
      'have.length',
      1,
    );
  });
});
