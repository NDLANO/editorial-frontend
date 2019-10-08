/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

const ARTICLE_ID = 12173;

describe('Language handling', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });

    editorRoutes(ARTICLE_ID);

    cy.visit(
      `/subject-matter/topic-article/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@tags', '@licenses', '@draft']);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });
});
