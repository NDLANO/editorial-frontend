export default ARTICLE_ID => {
  if (ARTICLE_ID) {
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      'draft',
    );
    cy.route(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      'fixture:draft.json',
    ).as('updateDraft');
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}/history?language=nb&fallback=true`,
      'articleHistory',
    );
  }

  cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');

  cy.apiroute(
    'GET',
    '/draft-api/v1/drafts/status-state-machine/',
    'statusMachine',
  );

  cy.apiroute('GET', '/draft-api/v1/drafts/tags/**', 'tags');
  cy.apiroute('GET', '/draft-api/v1/agreements?query=', 'agreements');
  cy.apiroute(
    'GET',
    '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=',
    'relatedArticles',
  );
  cy.apiroute('POST', '/draft-api/v1/drafts/', 'saveLearningResource');
};
