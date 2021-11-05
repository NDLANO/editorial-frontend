import { setToken } from '../../support';

describe('search podcasts', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', `/audio-api/v1/series/*`, 'podcastSeries');
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute('GET', '/draft-api/v1/user-data', 'getUserData');
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/podcast-series');
    cy.apiwait(['@podcastSeries']);
  });

  it('correctly applies and removes all filters and orderings also using empty button', () => {
    cy.dataCy('searchButton').click();
    cy.apiwait(['@podcastSeries']);
    cy.apiroute('GET', `/audio-api/v1/series/?query=test`, 'podcastSeriesWithQuery');
    cy.dataCy('queryField')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.apiwait(['@podcastSeriesWithQuery']);
    cy.dataCy('query-tag').contains('test');
    cy.apiroute(
      'GET',
      `/audio-api/v1/series/?language=nn&query=test`,
      'podcastSeriesWithQueryAndLanguage',
    );
    cy.dataCy('languageField')
      .find('select')
      .select('Nynorsk');

    cy.dataCy('language-tag').contains('Nynorsk');
    cy.dataCy('language-tag')
      .find('button')
      .click();
    cy.apiwait(['@podcastSeriesWithQuery']);
    cy.dataCy('query-tag')
      .find('button')
      .click();
    cy.dataCy('queryField')
      .invoke('val')
      .should('be.empty');
    cy.apiwait(['@podcastSeries']);

    cy.dataCy('queryField')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.dataCy('query-tag').contains('test');

    cy.dataCy('languageField')
      .find('select')
      .select('Nynorsk');
    cy.apiwait(['@podcastSeriesWithQueryAndLanguage']);

    cy.dataCy('searchEmpty').click();
    cy.apiwait(['@podcastSeries']);
    cy.dataCy('query-tag').should('not.exist');
    cy.dataCy('language-tag').should('not.exist');
    cy.dataCy('queryField')
      .invoke('val')
      .should('be.empty');
  });
});
