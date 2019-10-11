/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

const ARTICLE_ID = 14989;

describe('Edit article with everything', () => {
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

    editorRoutes();

    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      'draftFull',
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nn&fallback=true`,
      'draftNN',
    );
    cy.apiroute('PATCH', `/draft-api/v1/drafts/${ARTICLE_ID}`, 'saveLearningResource');

    cy.visit(
      `/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@tags', '@licenses', '@draftFull']);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header button')
      .contains('Legg til språk')
      .click({ force: true });
    cy.get('header a')
      .contains('Nynorsk')
      .click({ force: true });
    cy.apiwait('@draftNN');
  });

  it('Can edit the published date', () => {
    // check that article is not dirty
    cy.get('[data-testid=saveLearningResourceButton]').should('be.disabled');
    cy.get('span[name=published] > button').click();
    cy.get('.flatpickr-day ')
      .first()
      .click();
    
    cy.get('[data-testid=saveLearningResourceButton]').click();
    cy.apiwait('@saveLearningResource');
  });
});
