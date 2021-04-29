const editorRoutes = ARTICLE_ID => {
  if (ARTICLE_ID) {
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      `draft-${ARTICLE_ID}`,
    );
    cy.apiroute(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      `updateDraft-${ARTICLE_ID}`,
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}/history?language=nb&fallback=true`,
      `articleHistory-${ARTICLE_ID}`,
    );
    cy.apiroute(
      'PUT',
      `/draft-api/v1/drafts/${ARTICLE_ID}/validate/`,
      'validateDraft',
    );
  }

  cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
  cy.apiroute('GET', '/draft-api/v1/drafts/status-state-machine/', 'statusMachine');
  cy.apiroute('GET', '/concept-api/v1/drafts/status-state-machine/','conceptStatusMachine');

  cy.intercept('GET', '/taxonomy/v1/resources/**', []);
  cy.intercept('GET', '/taxonomy/v1/topics/**', '[]');

  cy.apiroute('GET', '/draft-api/v1/agreements?query=', 'agreements');
  cy.apiroute('GET', '**/get_note_users?*', 'getNoteUsers');
  cy.apiroute('GET', '/draft-api/v1/user-data', 'getUserData');
  cy.apiroute('PATCH', '/draft-api/v1/user-data', 'patchUserData');
  cy.apiroute('POST', '/draft-api/v1/drafts/search/', 'relatedArticles');
  cy.apiroute('POST', '/draft-api/v1/drafts/', 'saveLearningResource');
};

export default editorRoutes;
