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
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&sort=-lastUpdated',
       'searchConcepts',
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
     cy.visit('/search/concept?page=1&page-size=10&sort=-lastUpdated');
     cy.apiwait(['@searchConcepts', '@allSubjects']);
   });
 
   it('Can use text input', () => {
     cy.apiroute(
       'GET',
       '**/concept-api/v1/drafts/?*query=Test*',
       'searchConceptQuery',
     );
     cy.get('input[name="query"]')
       .type('Test')
       .blur();
     cy.apiwait('@searchConceptQuery');
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
     cy.apiwait('@searchConceptStatus');
     cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
     cy.get('select[name="status"]').select('Velg status');
   });
 
   it('Can use language type dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?language=nn*',
       'searchConceptLang',
     );
     cy.get('select[name="language"]')
       .select('Nynorsk')
       .blur();
     cy.apiwait('@searchConceptLang');
     cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
     cy.get('select[name="language"]').select('Velg språk');
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
     cy.apiwait('@searchConceptSubject');
     cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
     cy.get('select[name="subjects"]').select('Velg fag');
   });
 
   it('Can use user dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?*users=PrcePFwCDOsb2_g0Kcb-maN0',
       'searchConceptUser',
     );
     cy.get('select[name="users"]')
       .select('Ed Test')
       .blur();
     cy.apiwait('@searchConceptUser');
     cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
     cy.get('select[name="users"]').select('Velg bruker');
   });
 });
 