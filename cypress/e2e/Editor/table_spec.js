/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

describe('Table plugin', () => {
  before(() => {
    setToken();
    editorRoutes();
    cy.visit('/subject-matter/learning-resource/new');
    cy.apiwait(['@zendeskToken','@getUserData','@getUsersResponsible','@licenses','@statusMachine']);
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().focus();
    cy.get('[data-slate-node=element] > p').should('be.visible').click();
    cy.get('[data-cy=slate-block-picker]').should('exist');
    cy.get('[data-cy=slate-block-picker]').should('be.visible');
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[data-cy="slate-block-picker-menu"]').should('exist');
    cy.get('[data-cy="slate-block-picker-menu"]').should('be.visible');
  });

  it('all table functions work', () => {
    cy.get('[data-cy=create-table]').click();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().focus().type('TITTEL');
    cy.get('tbody > tr > td').first().type('Cell');
    cy.get('thead > tr > td').first().type('Header 1 {rightArrow} Header 2');
    cy.get('[data-cy=column-add]').click();
    cy.get('thead > tr > td').last().type('Test new column');
    cy.get('[data-cy=row-remove]').click();
    cy.get('[data-cy=head-add]').click();
    cy.get('thead > tr > td').first().type('Test new header {downArrow}');
    cy.get('[data-cy=row-add]').click();
    cy.get('tbody > tr > td').last().type('Test new row');
    cy.get('[data-cy=toggle-row-headers]').click();
    cy.get('[data-cy=column-remove]').click();
    cy.get('[data-cy=row-remove]').click();
    cy.get('[data-cy=table-remove]').click();
  });
});