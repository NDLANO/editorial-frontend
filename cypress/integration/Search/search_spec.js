/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import editorRoutes from "../Editor/editorRoutes";

describe('Search content', () => {
  beforeEach(() => {
    setToken();
    editorRoutes();

    cy.apiroute('GET', '/taxonomy/v1/resource-types/?language=nb', 'resourceTypes');
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/search-api/v1/search/editorial/?fallback=true&language=nb&page=1&page-size=10&sort=-relevance',
      'search'
    );
    cy.apiroute('GET', '**/get_editors*', 'editors');
    cy.visit('/search/content?fallback=true&language=nb&page=1&page-size=10&sort=-relevance', visitOptions);
    cy.apiwait(['@resourceTypes', '@search', '@allSubjects', '@editors']);
  });

  it('Can use text input', () => {
    cy.apiroute('GET', '**/search-api/v1/search/editorial/?*query=Test*', 'search2');
    cy.get('input[name="query"]').type('Test').blur();
    cy.apiwait('@search2');
  });

  it('Can use status dropdown', () => {
    cy.apiroute('GET', '**/search-api/v1/search/editorial/?*draft-status=USER_TEST*', 'search2');
    cy.get('select[name="status"]').select('Brukertest').blur();
    cy.apiwait('@search2');
  });

  it('Can use resource type dropdown', () => {
    cy.apiroute('GET', '**/search-api/v1/search/editorial/?*academicArticle*', 'search2');
    cy.get('select[name="resourceTypes"]').select('Fagartikkel').blur();
    cy.apiwait('@search2');
  });

  it('Can use subject dropdown', () => {
    cy.apiroute('GET', '**/search-api/v1/search/editorial/*', 'search2');
    cy.get('select[name="subjects"]').select('Medieuttrykk og mediesamfunnet').blur();
    cy.apiwait('@search2');
  });

  it('Can use user dropdown', () => {
    cy.apiroute('GET', '**/search-api/v1/search/editorial/*', 'search2');
    cy.get('select[name="users"]').select('Gunnar Velle').blur();
    cy.apiwait('@search2');
  });
});
