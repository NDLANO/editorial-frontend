/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';
import coreResources from '../../fixtures/coreResources';

describe('Resource listing', () => {
  beforeEach(() => {
    setToken();

    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true&language=nb',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/filters',
      'allSubjectFilters',
    );
    cy.apiroute('GET', '/taxonomy/v1/filters/?language=nb', 'allFilters');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      '**/taxonomy/v1/topics/**/resources/?language=nb',
      'coreResources',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/urn:topic:1:183043',
      'topic-183043',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/urn:topic:1:183437',
      'topic-183437',
    );
    cy.apiroute('GET', '**/draft-api/v1/drafts/**', 'article');
    cy.apiroute(
      'GET',
      '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=&content-type=topic-article',
      'getArticles',
    );
    cy.intercept('PUT', '/taxonomy/v1/topics/urn:topic:1:183437', '');
    cy.visit('/structure/urn:subject:12/urn:topic:1:183043/urn:topic:1:183437');
    cy.apiwait('@allSubjects');
    cy.apiwait('@allSubjectTopics');
    cy.apiwait('@allSubjectFilters');
    cy.apiwait('@allFilters');
    cy.apiwait('@coreResources');
    cy.apiwait('@article');
    cy.apiwait('@topic-183043');
    cy.apiwait('@topic-183437');
  });

  it('should open filter picker and have functioning buttons', () => {
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resources/urn:resource:1:167841/filters?language=nb',
      'resourceFilters',
    );

    cy.get(`[data-testid="openFilterPicker-${coreResources[0].id}"]`).click();
    cy.apiwait('@resourceFilters');
    cy.get(
      '[data-testid="useFilterCheckbox-urn:filter:df8344b6-ad86-44be-b6b2-d61b3526ed29"]',
    ).click();
    cy.get(
      '[data-testid="selectCoreRelevance-urn:filter:df8344b6-ad86-44be-b6b2-d61b3526ed29"]',
    ).click();
  });
});
