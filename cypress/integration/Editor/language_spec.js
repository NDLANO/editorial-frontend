/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import t from '../../../src/phrases/phrases-nb';

const ARTICLE_ID = 322;

describe('Language handling', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute(
      'GET',
      '/draft-api/v1/drafts/tags/?language=nb&size=7000',
      'tags',
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      'draft',
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nn&fallback=true`,
      'draftNN',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.apiroute('GET', '/article-api/v2/articles/**', 'relatedArticle');
    cy.apiroute('GET', '/taxonomy/v1/queries/resources/**', 'relatedTaxonomy');
    cy.route('PATCH', `/draft-api/v1/drafts/${ARTICLE_ID}`, 'fixture:draft.json').as(
      'updateDraft',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/status-state-machine/', 'statusMachine');
    cy.visit(`/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`, visitOptions);
    cy.apiwait('@tags');
    cy.apiwait('@licenses');
    cy.apiwait('@draft');
    cy.apiwait('@relatedArticle');
  });

  it('Can change language and fetch the new article', () => {
      cy.get('header [role="button"]').contains('Nynorsk').click({force: true});
      cy.apiwait('@draftNN');
  });
});
