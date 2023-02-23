/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support/e2e';

describe('Search content', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', `${taxonomyApi}/resource-types?language=nb`, 'resourceTypes');
    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute('GET', '/draft-api/v1/drafts/status-state-machine/', 'statusMachine');
    cy.apiroute('GET', '/search-api/v1/search/editorial/*', 'search');
    cy.intercept('GET', '/get_editors*', [
      {
        name: 'Ed Test',
        app_metadata: {
          ndla_id: 'PrcePFwCDOsb2_g0Kcb-maN0',
        },
      },
    ]);
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/content?fallback=true&language=nb&page=1&page-size=10&sort=-relevance');
    cy.apiwait(['@resourceTypes', '@search', '@allSubjects', '@statusMachine', '@zendeskToken']);
  });

  it('Can use text input', () => {
    cy.apiroute('GET', '/search-api/v1/search/editorial/?*query=Test*', 'searchQuery');
    cy.get('input[name="query"]')
      .type('Test')
      .blur();
    cy.apiwait('@searchQuery');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('input[name="query"]').clear();
    cy.apiwait('@search');
  });

  it('Can use status dropdown', () => {
    cy.apiroute('GET', '/search-api/v1/search/editorial/?*draft-status=EXTERNAL_REVIEW*', 'searchStatus');
    cy.get('select[name="draft-status"]')
      .select('Eksternt gjennomsyn')
      .blur();
    cy.apiwait('@searchStatus');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="draft-status"]').select('Velg status');
    cy.apiwait('@search');
  });

  it('Status dropdown with HAS_PUBLISHED results in PUBLISHED with include-other-statuses', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?draft-status=PUBLISHED&exclude-revision-log=false&fallback=false&include-other-statuses=true&language=nb&page=2&page-size=10&sort=-relevance*',
      'searchOther',
    );
    cy.get('select[name="draft-status"]')
      .select('Har publisert versjon')
      .blur();
    cy.apiwait('@searchOther');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="draft-status"]').select('Velg status');
    cy.apiwait('@search');
  });

  it('Can use resource type dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*resource-types=urn%3Aresourcetype%3AacademicArticle*',
      'searchType',
    );
    cy.get('select[name="resource-types"]')
      .select('Fagartikkel')
      .blur();
    cy.apiwait('@searchType');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="resource-types"]').select('Velg innholdstype');
    cy.apiwait('@search');
  });

  it('Can use subject dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*subjects=urn%3Asubject%3A*',
      'searchSubject',
    );
    cy.get('select[name="subjects"]')
      .select('Mediesamfunnet 1')
      .blur();
    cy.apiwait('@searchSubject');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="subjects"]').select('Velg fag');
    cy.apiwait('@search');
  });

  it('Can use user dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*users=%22PrcePFwCDOsb2_g0Kcb-maN0%22*',
      'searchUser',
    );
    cy.get('select[name="users"]')
      .select('Ed Test')
      .blur();
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="users"]').select('Velg bruker');
    cy.apiwait('@search');
  });
});
