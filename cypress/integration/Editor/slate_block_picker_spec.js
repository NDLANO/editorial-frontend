import {setToken, visitOptions} from "../../support";

describe("can enter all types of blocks, add them and delete", () => {

  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.visit('/subject-matter/learning-resource/new', visitOptions);

    cy.get('[cy="slate-block-picker-menu"]').should('not.be.visible');
    cy.get('[data-slate-object=block] > p').first().click();
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[cy="slate-block-picker-menu"]').should('be.visible');
  });

  afterEach( () => {
    cy.get('[data-cy="learning-resource-title"]').focus();
    cy.get('[cy="slate-block-picker-button"]').should('have.css', 'z-index', '-1');
  });

  it('assures correct behavior on factAside', () => {
    cy.get('[data-cy="create-factAside"]').click();
    cy.get('[data-cy=remove-fact-aside]').click();
  });

  it('assures correct behavior on table', () => {
    cy.get('[data-cy=create-table]').click();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').focus();
    cy.get('[data-cy=table-remove]').click();
  });

  it('assures correct behavior on bodybox', () => {
    cy.get('[data-cy=create-bodybox]').click();
    cy.get('[data-cy="remove-bodybox"]').click();
  });

  it('assures correct behavior on details', () => {
    cy.get('[data-cy=create-details]').click();
    cy.get('[data-cy="remove-details"]').click();
  });

  /*
  it.only('assures correct behavior on image', () => {
    cy.get('[data-cy=create-image]').click();
    //cy.get('[data-cy="remove-details"]').click();
    cy.get('[data-cy="learning-resource-title"]').click({force:true});
  });
  */

});