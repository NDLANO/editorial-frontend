import { setToken } from '../../support';

describe('search podcasts', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute(
      'GET',
      '/audio-api/v1/series/?page=1&page-size=10&sort=-lastUpdated',
      'podcastSeries',
    );
    cy.apiroute(
      'GET',
      '/audio-api/v1/series/?page=2&page-size=10&sort=-lastUpdated',
      'podcastSeries2',
    );
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute('GET', '/draft-api/v1/user-data', 'getUserData');
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/podcast-series?page=1&page-size=10&sort=-lastUpdated');
    cy.apiwait(['@podcastSeries', '@podcastSeries2']);
  });

  it('correctly applies and removes all filters and orderings also using empty button', () => {
    cy.apiroute(
      'GET',
      '/audio-api/v1/series/?page=1&page-size=10&query=test&sort=-lastUpdated',
      'podcastSeriesWithQuery',
    );
    cy.apiroute(
      'GET',
      '/audio-api/v1/series/?page=2&page-size=10&query=test&sort=-lastUpdated',
      'podcastSeriesWithQuery2',
    );
    cy.dataCy('queryField')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.dataCy('query-tag').contains('test');
    cy.apiwait(['@podcastSeriesWithQuery', '@podcastSeriesWithQuery2']);
    cy.apiroute(
      'GET',
      `/audio-api/v1/series/?language=nn&page=1&page-size=10&query=test&sort=-lastUpdated`,
      'podcastSeriesWithQueryAndLanguage',
    );
    cy.apiroute(
      'GET',
      `/audio-api/v1/series/?language=nn&page=2&page-size=10&query=test&sort=-lastUpdated`,
      'podcastSeriesWithQueryAndLanguage2',
    );
    cy.dataCy('languageField')
      .find('select')
      .select('Nynorsk');

    cy.dataCy('language-tag').contains('Nynorsk');
    cy.apiwait(['@podcastSeriesWithQueryAndLanguage', '@podcastSeriesWithQueryAndLanguage2']);
    cy.dataCy('language-tag')
      .find('button')
      .click();
    cy.dataCy('language-tag').should('not.exist');
    cy.dataCy('query-tag')
      .find('button')
      .click();
    cy.dataCy('query-tag').should('not.exist');
    cy.dataCy('queryField')
      .invoke('val')
      .should('be.empty');
    cy.apiwait(['@podcastSeries', '@podcastSeries2']);

    cy.dataCy('queryField')
      .click()
      .should('be.focused')
      .type('test{ENTER}');
    cy.dataCy('query-tag').contains('test');
    cy.apiwait(['@podcastSeriesWithQuery', '@podcastSeriesWithQuery2']);

    cy.dataCy('languageField')
      .find('select')
      .select('Nynorsk');
    cy.apiwait(['@podcastSeriesWithQueryAndLanguage']);

    cy.dataCy('searchEmpty').click();
    cy.apiwait(['@podcastSeries', '@podcastSeries2']);
    cy.dataCy('query-tag').should('not.exist');
    cy.dataCy('language-tag').should('not.exist');
    cy.dataCy('queryField')
      .invoke('val')
      .should('be.empty');
  });
});
