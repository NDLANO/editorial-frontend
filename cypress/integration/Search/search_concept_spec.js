/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import { visitOptions, setToken } from '../../support';

 describe('Search concepts', () => {
   beforeEach(() => {
     setToken();
     cy.server({ force404: true });
     cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&sort=-lastUpdated',
       'searchConcepts',
     );
     cy.apiroute('GET', '/get_editors*', 'editors');
     cy.visit(
       '/search/concept?page=1&page-size=10&sort=-lastUpdated',
       visitOptions,
     );
     cy.apiwait(['@searchConcepts', '@allSubjects', '@editors']);
   });
 
   it('Can use text input', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&query=Test&sort=-lastUpdated&types=concept',
       'searchConceptQuery',
     );
     cy.get('input[name="query"]')
       .type('Test')
       .blur();
     cy.apiwait('@searchConceptQuery');
   });
 
   it('Can use status dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&sort=-lastUpdated&status=QUEUED_FOR_LANGUAGE&types=concept',
       'searchConceptStatus',
     );
     cy.get('select[name="status"]')
       .select('Til språk')
       .blur();
     cy.apiwait('@searchConceptStatus');
   });
 
   it('Can use language type dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?language=nn&page=1&page-size=10&sort=-lastUpdated&types=concept',
       'searchConceptLang',
     );
     cy.get('select[name="language"]')
       .select('Nynorsk')
       .blur();
     cy.apiwait('@searchConceptLang');
   });
 
   it('Can use subject dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&sort=-lastUpdated&subjects=urn:subject:1&types=concept',
       'searchConceptSubject',
     );
     cy.get('select[name="subjects"]')
       .select('Medieuttrykk og mediesamfunnet Vg2 og Vg3')
       .blur();
     cy.apiwait('@searchConceptSubject');
   });
 
   it('Can use user dropdown', () => {
     cy.apiroute(
       'GET',
       '/concept-api/v1/drafts/?page=1&page-size=10&sort=-lastUpdated&types=concept&users=vKAhUstqtfjF5EauMVl2kz93',
       'searchConceptUser',
     );
     cy.get('select[name="users"]')
       .select('Anders Dahlin')
       .blur();
     cy.apiwait('@searchConceptUser');
   });
 });
 