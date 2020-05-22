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
    cy.apiroute('GET', '/taxonomy/v1/subjects?includeMetadata=true&language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?includeMetadata=true&recursive=true',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/filters',
      'allSubjectFilters',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/filters/?language=nb',
      'allFilters'
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/**/resources/?language=nb',
      'coreResources',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/topics/urn:topic:1:183043',
      'topic',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/**', 'article');
    cy.apiroute(
      'GET',
      '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=&content-type=topic-article',
      'getArticles',
    );
    cy.route('PUT', '/taxonomy/v1/topics/urn:topic:1:183437', '');
    cy.visit(
      '/structure/urn:subject:12/urn:topic:1:183043/urn:topic:1:183437',
      visitOptions,
    );
    cy.apiwait('@allSubjects');
    cy.apiwait('@allSubjectTopics');
    cy.apiwait('@allSubjectFilters');
    cy.apiwait('@allFilters');
    cy.apiwait('@coreResources');
    cy.apiwait('@article');
    cy.apiwait('@topic');
  });

  it('should open filter picker and have functioning buttons', () => {
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resources/urn:resource:1:167902/filters?language=nb',
      'resourceFilters',
    );

    cy.get(`[data-testid="openFilterPicker-${coreResources[0].id}"]`).click();
    cy.apiwait('@resourceFilters');
    cy.get(
      '[data-testid="useFilterCheckbox-urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce"]',
    ).click();
    cy.get(
      '[data-testid="selectCoreRelevance-urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce"]',
    ).click();
  });
});
