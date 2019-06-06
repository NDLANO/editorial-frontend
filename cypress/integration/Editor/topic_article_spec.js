/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';

const ARTICLE_ID = 12173;

describe('Language handling', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/draft-api/v1/drafts/tags/**', 'tags');
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      'draftTopic',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.visit(
      `/subject-matter/topic-article/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@tags', '@licenses', '@draftTopic']);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });
});
