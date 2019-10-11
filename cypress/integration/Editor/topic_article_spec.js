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
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return (
          xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
        );
      },
    });

    editorRoutes(ARTICLE_ID);

    cy.visit(
      `/subject-matter/topic-article/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@tags', '@licenses', `@draft:${ARTICLE_ID}`]);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });
});
