/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import editorRoutes from './editorRoutes';

// change article ID and run cy-record to add the new fixture data
const ARTICLE_ID = 800;

describe('Status changes', () => {
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
    cy.apiroute(
      'PUT',
      `/draft-api/v1/drafts/${ARTICLE_ID}/status/PROPOSAL`,
      `statusChange`,
    );
    cy.apiroute(
      'PUT',
      `/draft-api/v1/drafts/${ARTICLE_ID}/validate/`,
      'validateDraft',
    );

    cy.visit(
      `/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@licenses', `@draft:${ARTICLE_ID}`]);
    cy.wait(500);
  });

  it('Can change status corretly', () => {
    // change from published to proposal
    cy.get('footer button')
      .contains('Publisert')
      .click();
    cy.get('footer li > button')
      .contains('Utkast')
      .click();
    cy.get('footer button')
      .contains('Endre status')
      .click();
    cy.apiwait(`@statusChange`);

    // change from proposal to QUEUED_FOR_PUBLISHING triggers validation
    cy.get('footer button')
      .contains('Utkast')
      .click();
    cy.get('footer li > button')
      .contains('Til publisering')
      .click();
    cy.get('footer button')
      .contains('Endre status')
      .click();
    cy.apiwait(`@validateDraft`);
    cy.apiwait(`@statusChange`);

    // making a change triggers first save then status change
    cy.get('[data-cy=learning-resource-title]').type('TEST');
    cy.get('footer button')
      .contains('Til publisering')
      .click();
    cy.get('footer li > button')
      .contains('Publiser')
      .click();
    cy.get('footer button')
      .contains('Endre status')
      .click();
    cy.apiwait(`@validateDraft`);
    cy.apiwait(`@updateDraft:${ARTICLE_ID}`);
    cy.apiwait(`@statusChange`);
  });
});
