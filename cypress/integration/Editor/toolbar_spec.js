import { beforeEachHelper } from '../../support';

beforeEach(() => beforeEachHelper('/subject-matter/learning-resource/new'));

describe('Selecting text and using the toolbar', () => {
  it('change the text styling', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el).type('This is test content{selectall}');
        cy.get('[data-testid=toolbar-button-bold]').click();
        cy.get('[data-testid=toolbar-button-italic]').click();
        cy.get('[data-testid=toolbar-button-underlined]').click();
        cy.get('[data-testid=toolbar-button-quote]').click();
        cy.wrap($el).type('{rightarrow}{enter}{enter}test new line{selectall}');
        cy.get('blockquote')
          .contains('test new line')
          .should('not.exist');
        cy.get('[data-testid=toolbar-button-bold]').click();
        cy.get('[data-testid=toolbar-button-italic]').click();
        cy.get('[data-testid=toolbar-button-underlined]').click();
        cy.get('[data-testid=toolbar-button-heading-two]').click();
        cy.get('[data-testid=toolbar-button-heading-three]').click();
        cy.wrap($el)
          .find('h3')
          .should('have.length', 2);
      });
  });

  it('can create a valid link', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el).type('This is a link{selectall}');
        cy.get('[data-testid=toolbar-button-link]').click();
        cy.get('button')
          .contains('Sett inn lenke')
          .click();
        cy.get('input[name=href]').type('http://www.vg.no');
        cy.get('button')
          .contains('Sett inn lenke')
          .click();
        cy.wrap($el).type('{selectall}');
        cy.get('a')
          .contains('http://www.vg.no')
          .should('have.prop', 'href')
          .and('equal', 'http://www.vg.no/');
      });
  });
  it('All lists work properly', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el).type('First item in list{selectall}');
        cy.get('[data-testid=toolbar-button-numbered-list]').click();
        cy.get('ol > li').should('have.length', 1);
        cy.wrap($el).type('{rightarrow}{enter}Second item in list{selectall}');
        cy.get('[data-testid=toolbar-button-bulleted-list]').click();
        cy.get('ul > li').should('have.length', 2);
        cy.wrap($el).type(
          '{rightarrow}{enter}Its now a bullet list{selectall}',
        );
        cy.get('[data-testid=toolbar-button-letter-list]').click();
        cy.get('ol > li').should('have.length', 3);
        cy.wrap($el).type('{rightarrow}{enter}Now its letters!{selectall}');
        cy.get('[data-testid=toolbar-button-two-column-list]').click();
        cy.get('ul > li').should('have.length', 4);
      });
  });
  it('Creates footnote', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .type('footnote{selectall}');
    cy.get('[data-testid=toolbar-button-footnote]').click();
    cy.get('.c-lightbox input[name=title]').type('Testnavn');
    cy.get('input[name=year]').type('1984');
    cy.get('[data-testid=multiselect-authors] input').type('Navn navnesen');
    cy.get('li')
      .contains('Opprett ny forfatter')
      .click();
    cy.get('.c-lightbox')
      .find('button')
      .contains('Lagre')
      .click();
    cy.get('a > sup').click();
    cy.get('h2').contains('Rediger fotnote');
  });
});
