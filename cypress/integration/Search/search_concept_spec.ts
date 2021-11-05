/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../src/config';
import { setToken } from '../../support';

describe('Search concepts', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', `${taxonomyApi}/subjects?language=nb`, 'allSubjects');
    cy.apiroute('GET', '/concept-api/v1/drafts/*', 'searchConcepts');
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.intercept('GET', '/get_editors*', [
      {
        name: 'Ed Test',
        app_metadata: {
          ndla_id: 'PrcePFwCDOsb2_g0Kcb-maN0',
        },
      },
    ]);
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/concept?page=1&page-size=10&sort=-lastUpdated');
    cy.apiwait(['@searchConcepts', '@licenses', '@allSubjects', '@zendeskToken']);
  });

  it('Can use text input', () => {
    cy.apiroute('GET', '**/concept-api/v1/drafts/?*query=Test*', 'searchConceptQuery');
    cy.get('input[name="query"]')
      .type('Test')
      .blur();
    cy.apiwait(['@searchConceptQuery']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('input[name="query"]').clear();
  });

  it('Can use status dropdown', () => {
    cy.apiroute(
      'GET',
      '/concept-api/v1/drafts/?*status=QUEUED_FOR_LANGUAGE*',
      'searchConceptStatus',
    );
    cy.get('select[name="status"]')
      .select('Til språk')
      .blur();
    cy.apiwait(['@searchConceptStatus']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="status"]').select('Velg status');
    cy.apiwait(['@searchConcepts']);
  });

  it('Can use language type dropdown', () => {
    cy.apiroute('GET', '/concept-api/v1/drafts/?language=nn*', 'searchConceptLang');
    cy.get('select[name="language"]').select('Nynorsk');
    cy.apiwait(['@searchConceptLang']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="language"]').select('Velg språk');
    cy.apiwait(['@searchConcepts']);
  });

  it('Can use subject dropdown', () => {
    cy.apiroute(
      'GET',
      '/concept-api/v1/drafts/?*subjects=urn%3Asubject%3A1*',
      'searchConceptSubject',
    );
    cy.get('select[name="subjects"]')
      .select('Medieuttrykk og mediesamfunnet Vg2 og Vg3')
      .blur();
    cy.apiwait(['@searchConceptSubject']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="subjects"]').select('Velg fag');
    cy.apiwait(['@searchConcepts']);
  });

  it('Can use user dropdown', () => {
    cy.apiroute(
      'GET',
      '/concept-api/v1/drafts/?*users=PrcePFwCDOsb2_g0Kcb-maN0',
      'searchConceptUser',
    );
    cy.get('select[name="users"]').select('Ed Test');
    cy.apiwait(['@searchConceptUser']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="users"]').select('Velg bruker');
    cy.apiwait(['@searchConcepts']);
  });
});
