/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Search content', () => {
  before(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/taxonomy/v1/resource-types/?language=nb', 'resourceTypes');
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?fallback=true&language=nb&page=1&page-size=10&sort=-relevance',
      'search',
    );
    cy.route('GET', '/get_editors*');
    cy.visit(
      '/search/content?fallback=true&language=nb&page=1&page-size=10&sort=-relevance',
      visitOptions,
    );
    cy.apiwait(['@resourceTypes', '@search', '@allSubjects']);
  });
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
  });

  it('Can use text input', () => {
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?fallback=true&include-other-statuses=false&language=nb&page=1&page-size=10&query=Test&sort=-relevance',
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
      '/search-api/v1/search/editorial/?draft-status=USER_TEST&fallback=true&include-other-statuses=false&language=nb&page=1&page-size=10&sort=-relevance',
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
      '/search-api/v1/search/editorial/?draft-status=PUBLISHED&fallback=true&include-other-statuses=true&language=nb&page=1&page-size=10&sort=-relevance',
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
      '/search-api/v1/search/editorial/?fallback=true&include-other-statuses=false&language=nb&page=1&page-size=10&resource-types=urn:resourcetype:academicArticle&sort=-relevance',
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
      '/search-api/v1/search/editorial/?fallback=true&include-other-statuses=false&language=nb&page=1&page-size=10&sort=-relevance&subjects=urn:subject:1',
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
      '/search-api/v1/search/editorial/?fallback=true&include-other-statuses=false&language=nb&page=1&page-size=10&sort=-relevance&users="Y7JV1gH0YzjW4AwkSyH7LIi8"',
      'searchUser',
    );
    cy.get('select[name="users"]')
      .select('Gunnar Velle')
      .blur();
    cy.apiwait('@searchUser');
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="users"]').select('Velg bruker');
  });
});
