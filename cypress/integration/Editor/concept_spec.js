/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';

const CONCEPT_ID = 1;

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

    cy.apiroute(
      'GET',
      `/concept-api/v1/drafts/${CONCEPT_ID}?language=nb&fallback=true`,
      `concept-${CONCEPT_ID}`,
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');

    cy.visit(
      `/concept/${CONCEPT_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@licenses', `@concept-${CONCEPT_ID}`]);
  });

  it('Can change language and fetch the new concept', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });
});
