/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support';

describe('Search content', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', `${taxonomyApi}/resource-types/?language=nb`, 'resourceTypes');
    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?fallback=true&language=nb&page=1&page-size=10&sort=-relevance',
      'search',
    );
    cy.apiroute(
       'GET',
       '/draft-api/v1/drafts/licenses/',
       'licenses',
     );
    cy.intercept(
      'GET', 
      '/get_editors*',
      [{
        "name": "Ed Test",
        "app_metadata": {
          "ndla_id": "PrcePFwCDOsb2_g0Kcb-maN0",
        }
      }]);
    cy.visit('/search/content?fallback=true&language=nb&page=1&page-size=10&sort=-relevance');
    cy.apiwait(['@resourceTypes', '@search', '@allSubjects', '@licenses']);
  });

  it('Can use text input', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*query=Test*',
      'searchQuery',
    );
    cy.get('input[name="query"]')
      .type('Test')
      .blur();
    cy.apiwait('@searchQuery');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('input[name="query"]').clear();
  });

  it('Can use status dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?draft-status=USER_TEST*',
      'searchStatus',
    );
    cy.get('select[name="status"]')
      .select('Brukertest')
      .blur();
    cy.apiwait('@searchStatus');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="status"]').select('Velg status');
  });

  it('Status dropdown with HAS_PUBLISHED results in PUBLISHED with include-other-statuses', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?draft-status=PUBLISHED&fallback=true&include-other-statuses=true*',
      'searchOther',
    );
    cy.get('select[name="status"]')
      .select('Har publisert versjon')
      .blur();
    cy.apiwait('@searchOther');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="status"]').select('Velg status');
  });

  it('Can use resource type dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*resource-types=urn%3Aresourcetype%3AacademicArticle*',
      'searchType',
    );
    cy.get('select[name="resourceTypes"]')
      .select('Fagartikkel')
      .blur();
    cy.apiwait('@searchType');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="resourceTypes"]').select('Velg innholdstype');
  });

  it('Can use subject dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*subjects=urn%3Asubject%3A1',
      'searchSubject',
    );
    cy.get('select[name="subjects"]')
      .select('Medieuttrykk og mediesamfunnet Vg2 og Vg3')
      .blur();
    cy.apiwait('@searchSubject');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="subjects"]').select('Velg fag');
  });

  it('Can use user dropdown', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?*users=%22PrcePFwCDOsb2_g0Kcb-maN0%22',
      'searchUser',
    );
    cy.get('select[name="users"]')
      .select('Ed Test')
      .blur();
    cy.apiwait('@searchUser');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
  });
});
