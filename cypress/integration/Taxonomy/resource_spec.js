/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support';
import coreResources from '../../fixtures/coreResources';

const selectSubject = 'urn:subject:20';
const selectTopic = 'urn:topic:1:186732';

describe('Resource listing', () => {
  beforeEach(() => {
    setToken();

    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/subjects/${selectSubject}/topics?recursive=true&language=nb`,
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      `${taxonomyApi}/subjects/${selectSubject}/filters`,
      'allSubjectFilters',
    );
    cy.apiroute('GET', `${taxonomyApi}/filters/?language=nb`, 'allFilters');
    cy.apiroute(
      'GET',
      `${taxonomyApi}/resource-types/?language=nb`,
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      `${taxonomyApi}/topics/**/resources/?language=nb`,
      'coreResources',
    );
    cy.apiroute(
      'GET',
      `${taxonomyApi}/topics/urn:topic:**`,
      'topic-183043',
    );
    cy.apiroute('GET', '**/draft-api/v1/drafts/**', 'article');
    cy.apiroute(
      'GET',
      '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=&content-type=topic-article',
      'getArticles',
    );
    cy.intercept('PUT', `${taxonomyApi}/topics/${selectTopic}`, '');
    cy.visit(`/structure/${selectSubject}/${selectTopic}`);
    cy.apiwait('@allSubjects');
    cy.apiwait('@allSubjectTopics');
    cy.apiwait('@allSubjectFilters');
    cy.apiwait('@allFilters');
    cy.apiwait('@coreResources');
    cy.apiwait('@article');
    cy.apiwait('@topic-183043');
  });

  it('should open filter picker and have functioning buttons', () => {
    cy.apiroute(
      'GET',
      `${taxonomyApi}/resources/urn:resource:1:167841/filters?language=nb`,
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
