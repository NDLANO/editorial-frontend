/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';
import editorRoutes from './editorRoutes';

describe('Selecting text and using the toolbar', () => {
  before(() => {
    setToken();
    editorRoutes();
    cy.visit('/subject-matter/learning-resource/new');
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
  });

  it('change the text styling', () => {
    cy.get('[data-slate-node=element] > p').clear();
    cy.get('[data-slate-node=element] > p')
      .should('be.visible')
      .first()
      .click();
    cy.get('[data-cy=slate-block-picker]').should('be.visible');
    cy.get('[data-slate-node=element] > p')
      .type('This is test content{leftarrow}{leftarrow}')
      .contains('This is test content')
      .type('{selectall}');

    cy.get('[data-testid=toolbar-button-bold]').click({ force: true });
    cy.get('[data-testid=toolbar-button-bold][data-active=true]').should('exist');
    cy.get('[data-testid=toolbar-button-italic]').click({ force: true });
    cy.get('[data-testid=toolbar-button-italic][data-active=true]').should('exist');
    cy.get('[data-testid=toolbar-button-quote]').click({ force: true });
    cy.get('[data-testid=toolbar-button-quote][data-active=true]').should('exist');
    cy.get('span')
      .contains('This is test content')
      .type('{rightarrow}{enter}{enter}test new line{selectall}');
    cy.get('blockquote')
      .contains('test new line')
      .should('not.exist');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .last()
      .then($el => {
        cy.get($el)
          .focus()
          .type('{selectall}last line{selectall}');
        cy.get('[data-testid=toolbar-button-bold]').click();
        cy.get('[data-testid=toolbar-button-bold][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-italic]').click();
        cy.get('[data-testid=toolbar-button-italic][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-code]').click();
        cy.get('[data-testid=toolbar-button-code][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-sub]').click();
        cy.get('[data-testid=toolbar-button-sub][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-sup]').click();
        cy.get('[data-testid=toolbar-button-sup][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-heading-2]').click();
        cy.get('[data-testid=toolbar-button-heading-2][data-active=true]').should('exist');
        cy.wrap($el).type('{selectall}new heading{selectall}');
        cy.get('[data-testid=toolbar-button-heading-3]').click();
        cy.get('[data-testid=toolbar-button-heading-3][data-active=true]').should('exist');
        cy.wrap($el)
          .find('h3')
          .should('have.length', 1);
        cy.wrap($el).type('{selectall}');
      });
  });

  it('can create a valid link', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el)
          .type('This is a test link{leftarrow}{leftarrow}')
          .blur();
        cy.wrap($el).type('{selectall}');
      });

    cy.get('[data-testid=toolbar-button-link]')
      .should('be.visible')
      .click();
    cy.get('button')
      .contains('Sett inn lenke')
      .click();
    cy.get('input[name=href]').type('http://www.vg.no');
    cy.get('button')
      .contains('Sett inn lenke')
      .click();
    cy.get('a[href="http://www.vg.no"]').contains('This is a test link');
    cy.get('a[href="http://www.vg.no"]')
      .should('have.prop', 'href')
      .and('equal', 'http://www.vg.no/');
    cy.get('a[href="http://www.vg.no"][data-slate-node=element]')
      .contains('This is a test link')
      .click()
      .type('{selectall}');
  });

  it('All lists work properly', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .then($el => {
        cy.wrap($el)
          .focus()
          .type('First item in list');
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-numbered-list]').click();
        cy.get('[data-testid=toolbar-button-numbered-list][data-active=true]').should('exist');
        cy.get('ol > li').should('have.length', 1);
        cy.wrap($el).type('{rightarrow}{enter}Second item in list');
        cy.get('ol > li').should('have.length', 2);
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-bulleted-list]').click();
        cy.get('[data-testid=toolbar-button-bulleted-list][data-active=true]').should('exist');
        cy.get('ul > li').should('have.length', 2);
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-letter-list]').click();
        cy.get('[data-testid=toolbar-button-letter-list][data-active=true]').should('exist');
        cy.get('ol > li').should('have.length', 2);
        cy.wrap($el)
          .focus()
          .type('{selectall}');
      });
  });

  it('Creates footnote', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('footnote')
      .blur();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('{selectall}')
      .blur();
    cy.get('[data-testid=toolbar-button-footnote]').click({ force: true });
    cy.get('input[name=title]')
      .last()
      .type('Testnavn')
      .blur();
    cy.get('input[name=year]').type('1984');
    cy.get('[data-testid=multiselect]')
      .type('Navn navnesen')
      .blur();
    cy.get('button')
      .contains('Opprett ny')
      .click({ force: true });
    cy.get('[data-cy=save_footnote]').click({ force: true });
    cy.get('a > sup').click({ force: true });
    cy.get('h2').contains('Rediger fotnote');
    cy.get('[data-cy=save_footnote]').click({ force: true });
  });

  it('Creates math', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('{selectall}')
      .type('1+1')
      .blur();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('{selectall}')
      .blur();
    cy.get('[data-testid=toolbar-button-mathml]').click({ force: true });
    cy.get('[data-cy=math]').should('exist');
  });
});
