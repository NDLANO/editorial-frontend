export default ARTICLE_ID => {
  if (ARTICLE_ID) {
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      `draft:${ARTICLE_ID}`,
    );
    cy.apiroute(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      `updateDraft:${ARTICLE_ID}`,
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}/history?language=nb&fallback=true`,
      `articleHistory:${ARTICLE_ID}`,
    );    
    cy.apiroute(
      'PUT',
      `/draft-api/v1/drafts/${ARTICLE_ID}/validate/`,
      'validateDraft',
    );
  }

  cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');

  cy.apiroute(
    'GET',
    '/draft-api/v1/drafts/status-state-machine/',
    'statusMachine',
  );

  cy.route(
    'GET',
    '/taxonomy/v1/queries/**',
    '[]'
  );

  cy.apiroute('GET', '/draft-api/v1/agreements?query=', 'agreements');
  cy.apiroute(
    'POST',
    '/draft-api/v1/drafts/search/',
    'relatedArticles',
  );
  cy.apiroute('POST', '/draft-api/v1/drafts/', 'saveLearningResource');
};
