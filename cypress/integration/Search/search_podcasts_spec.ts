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
    cy.dataCy('podcastSearchButton').click();
    cy.apiwait(['@podcastSeries']);
    cy.apiroute('GET', `/audio-api/v1/series/?page=1&query=test`, 'podcastSeriesWithQuery');
    cy.dataCy('podcastQuery')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.apiwait(['@podcastSeriesWithQuery']);
    cy.dataCy('query-tag').contains('test');
    cy.apiroute(
      'GET',
      `/audio-api/v1/series/?language=nn&page=1&query=test`,
      'podcastSeriesWithQueryAndLanguage',
    );
    cy.dataCy('podcastChooseLanguage')
      .find('select')
      .select('Nynorsk');
    cy.apiwait(['@podcastSeriesWithQueryAndLanguage']);

    cy.dataCy('language-tag').contains('Nynorsk');
    cy.dataCy('language-tag')
      .find('button')
      .click();
    cy.apiwait(['@podcastSeriesWithQuery']);
    cy.dataCy('query-tag')
      .find('button')
      .click();
    cy.dataCy('podcastQuery')
      .invoke('val')
      .should('be.empty');
    cy.apiwait(['@podcastSeries']);

    cy.dataCy('podcastQuery')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.apiwait(['@podcastSeriesWithQuery']);
    cy.dataCy('query-tag').contains('test');

    cy.dataCy('podcastChooseLanguage')
      .find('select')
      .select('Nynorsk');
    cy.apiwait(['@podcastSeriesWithQueryAndLanguage']);

    cy.dataCy('podcastSearchEmpty').click();
    cy.apiwait(['@podcastSeries']);
    cy.dataCy('query-tag').should('not.exist');
    cy.dataCy('language-tag').should('not.exist');
    cy.dataCy('podcastQuery')
      .invoke('val')
      .should('be.empty');
  });
});
