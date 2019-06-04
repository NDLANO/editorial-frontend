/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import coreResources from '../../fixtures/coreResources';

describe('Resource listing', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/taxonomy/v1/subjects/?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/filters',
      'allSubjectFilters',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/urn:topic:1:183437/resources/?language=nb&relevance=urn:relevance:core&filter=',
      'coreResources',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/urn:topic:1:183437/resources/?language=nb&relevance=urn:relevance:supplementary&filter=',
      'suppResources',
    );
    cy.apiroute('GET', '/article-api/v2/articles/8785', ' article');
    cy.apiroute(
      'GET',
      '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=&content-type=topic-article',
      'getArticles',
    );
    cy.apiroute(
      'PUT',
      '/taxonomy/v1/topics/urn:topic:1:183437',
      'updateTopicDesc',
    );
    cy.visit('/structure/urn:subject:12', visitOptions);
  });
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
    cy.get('[data-testid=dropdownInput]').type('t');
    cy.get('button[role=option]')
      .first()
      .click();
    cy.apiwait('@updateTopicDesc');
  });
  it('should open filter picker and have functioning buttons', () => {
    cy.route(
      'GET',
      '/taxonomy/v1/resources/urn:resource:1:167841/filters?language=nb',
      ' resourceFilters',
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
