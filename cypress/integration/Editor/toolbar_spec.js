import { beforeEachHelper } from '../../support';

beforeEach(() => beforeEachHelper('/subject-matter/learning-resource/new'));

describe('Selecting text and using the toolbar', () => {
  // selectall stopped working
  it('change the text styling', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .then($el => {
        cy.wrap($el)
          .focus()
          .type('This is test content{leftarrow}{leftarrow}');
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-bold]').click({ force: true });
        cy.get('[data-testid=toolbar-button-italic]').click({ force: true });
        cy.get('[data-testid=toolbar-button-underlined]').click({
          force: true,
        });
        cy.get('[data-testid=toolbar-button-quote]').click({ force: true });
        cy.wrap($el).type('{rightarrow}{enter}{enter}test new line{selectall}');
        cy.get('blockquote')
          .contains('test new line')
          .should('not.exist');
        cy.get('[data-testid=toolbar-button-bold]').click({ force: true });
        cy.get('[data-testid=toolbar-button-italic]').click({ force: true });
        cy.get('[data-testid=toolbar-button-underlined]').click({
          force: true,
        });
        cy.get('[data-testid=toolbar-button-heading-two]').click({
          force: true,
        });
        cy.get('[data-testid=toolbar-button-heading-three]').click({
          force: true,
        });
        cy.wrap($el)
          .find('h3')
          .should('have.length', 1);
      });
  });

  /* Test not working anymore...
  it('can create a valid link', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()

      .then($el => {
        cy.wrap($el)
          .focus()
          .type('This is a link');
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-link]').click();
        cy.get('button')
          .contains('Sett inn lenke')
          .click();
        cy.get('input[name=href]').type('http://www.vg.no');
        cy.get('button')
          .contains('Sett inn lenke')
          .click();
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('a')
          .contains('http://www.vg.no')
          .should('have.prop', 'href')
          .and('equal', 'http://www.vg.no/');
      });
  }); */

  it('All lists work properly', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()

      .then($el => {
        cy.wrap($el)
          .focus()
          .type('First item in list');
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-numbered-list]').click({
          force: true,
        });
        cy.get('ol > li').should('have.length', 1);
        cy.wrap($el).type('{rightarrow}{enter}Second item in list');
        cy.get('ol > li').should('have.length', 2);
        cy.wrap($el)
          .focus()
          .type('{selectall}');
        cy.get('[data-testid=toolbar-button-bulleted-list]').click({
          force: true,
        });
        cy.get('ul > li').should('have.length', 1); // N.B {selectall} selects empty paragraphs so item increases by 2
        cy.get('[data-testid=toolbar-button-letter-list]').click({
          force: true,
        });
        cy.get('ol > li').should('have.length', 2);
        cy.get('[data-testid=toolbar-button-two-column-list]').click({
          force: true,
        });
        cy.get('ul > li').should('have.length', 1);
      });
  });

  it('Creates footnote', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .type('footnote');
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .type('{selectall}');
    cy.get('[data-testid=toolbar-button-footnote]').click({ force: true });
    cy.get('.c-lightbox input[name=title]').type('Testnavn');
    cy.get('input[name=year]').type('1984');
    cy.get('[data-testid=multiselect-authors] input').type('Navn navnesen');
    cy.get('li')
      .contains('Opprett ny forfatter')
      .click({ force: true });
    cy.get('.c-lightbox')
      .find('button')
      .contains('Lagre')
      .click({ force: true });
    cy.get('a > sup').click({ force: true });
    cy.get('h2').contains('Rediger fotnote');
  });
});
