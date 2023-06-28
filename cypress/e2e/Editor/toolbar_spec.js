/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

describe('Selecting text and using the toolbar', () => {
  beforeEach(() => {
    setToken();
    editorRoutes();
    cy.visit('/subject-matter/learning-resource/new');
    cy.apiwait([
      '@zendeskToken',
      '@getUserData',
      '@getUsersResponsible',
      '@licenses',
      '@statusMachine',
    ]);
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().click();
    cy.get('[data-slate-node=element] > p').should('be.visible');
    cy.get('[data-slate-node=element] > p').first().click();
  });

  it('change the text styling', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .click()
      .then(($el) => {
        cy.get($el).type('Text to style {selectAll}');
        cy.get('[data-testid=toolbar-button-bold]').click();
        cy.get('[data-testid=toolbar-button-bold][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-bold]').click();
        cy.get('[data-testid=toolbar-button-italic]').click();
        cy.get('[data-testid=toolbar-button-italic][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-italic]').click();
        cy.get('[data-testid=toolbar-button-code]').click();
        cy.get('[data-testid=toolbar-button-code][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-code]').click();
        cy.get('[data-testid=toolbar-button-sub]').click();
        cy.get('[data-testid=toolbar-button-sub][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-sub]').click();
        cy.get('[data-testid=toolbar-button-sup]').click();
        cy.get('[data-testid=toolbar-button-sup][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-sup]').click();
        cy.get('[data-testid=toolbar-button-heading-2]').click();
        cy.get('[data-testid=toolbar-button-heading-2][data-active=true]').should('exist');
        cy.get('[data-testid=toolbar-button-heading-2]').click();
        cy.wrap($el).type('{selectAll} new heading {selectAll}');
        cy.get('[data-testid=toolbar-button-heading-3]').click();
        cy.get('[data-testid=toolbar-button-heading-3][data-active=true]').should('exist');
        cy.wrap($el).find('h3').should('have.length', 1);
        cy.wrap($el).type('{selectAll}');
        cy.get('[data-testid=toolbar-button-heading-3]').click();
      });
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .type('{selectAll}This is test content{selectAll}');
    cy.get('[data-testid=toolbar-button-quote]').click();
    cy.get('[data-testid=toolbar-button-quote][data-active=true]').should('exist');
    cy.get('span')
      .contains('This is test content')
      .type('{end}{enter}{enter} test new line{selectAll}');
    cy.get('blockquote').contains('test new line').should('not.exist');
  });

  it('can create a valid link', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .click()
      .then(($el) => {
        cy.wrap($el).type('This is a test link{selectAll}');
        cy.get('[data-testid=toolbar-button-link]').should('be.visible');
        cy.get('[data-testid=toolbar-button-link]').click();
        cy.get('button').contains('Sett inn lenke').click();
        cy.get('input[name=href]').type('http://www.vg.no');
        cy.get('button').contains('Sett inn lenke').click();
        cy.get('a[href="http://www.vg.no"]').contains('This is a test link');
        cy.get('a[href="http://www.vg.no"]')
          .should('have.prop', 'href')
          .and('equal', 'http://www.vg.no/');
        cy.get('a[href="http://www.vg.no"][data-slate-node=element]').contains(
          'This is a test link',
        );
      });
  });

  it('All lists work properly', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .click()
      .then(($el) => {
        cy.wrap($el).type('First item in list');
        cy.wrap($el).type('{selectAll}');
        cy.get('[data-testid=toolbar-button-numbered-list]').should('be.visible');
        cy.get('[data-testid=toolbar-button-numbered-list]').click();
        cy.get('[data-testid=toolbar-button-numbered-list][data-active=true]').should('exist');
        cy.get('ol > li').should('have.length', 1);
        cy.wrap($el).type('{end}{enter}Second item in list');
        cy.get('ol > li').should('have.length', 2);
        cy.wrap($el).type('{selectAll}');
        cy.get('[data-testid=toolbar-button-bulleted-list]').should('be.visible');
        cy.get('[data-testid=toolbar-button-bulleted-list]').click();
        cy.get('[data-testid=toolbar-button-bulleted-list][data-active=true]').should('exist');
        cy.get('ul > li').should('have.length', 2);
        cy.wrap($el).type('{selectAll}');
        cy.get('[data-testid=toolbar-button-letter-list]').should('be.visible');
        cy.get('[data-testid=toolbar-button-letter-list]').click();
        cy.get('[data-testid=toolbar-button-letter-list][data-active=true]').should('exist');
        cy.get('ol > li').should('have.length', 2);
      });
  });

  it('Definition list work properly', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .click()
      .then(($el) => {
        cy.wrap($el).type('Definition term{selectAll}');
        cy.get('[data-testid=toolbar-button-definition-list]').should('be.visible');
        cy.get('[data-testid=toolbar-button-definition-list]').click();
        cy.get('[data-testid=toolbar-button-definition-list][data-active=true]').should('exist');
        cy.get('dl > dt').should('have.length', 1);
        cy.wrap($el).type('{enter}').tab().type(' Definition description');
        cy.get('dl > dd').should('have.length', 1);
      });
  });

  it('Selecting multiple paragraphs gives multiple terms', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .click()
      .then(($el) => {
        cy.wrap($el).type('Definition Term 1');
        cy.wrap($el).type('{end}{enter}Definition Term 2');
        cy.wrap($el).type('{end}{enter}Definition Term 3');
        cy.wrap($el).type('{selectAll}');
        cy.get('[data-testid=toolbar-button-definition-list]').should('be.visible');
        cy.get('[data-testid=toolbar-button-definition-list]').click();
        cy.get('[data-testid=toolbar-button-definition-list][data-active=true]').should('exist');
        cy.get('dl > dt').should(($lis) => {
          expect($lis).to.have.length.greaterThan(2);
        });
      });
  });

  it('Creates math', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().click().type('1+1').blur();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().type('{selectAll}').blur();
    cy.get('[data-testid=toolbar-button-mathml]').click({ force: true });
    cy.get('[data-cy=math]').should('exist');
  });
});
