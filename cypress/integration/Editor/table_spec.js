/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';
import editorRoutes from './editorRoutes';
import t from '../../../src/phrases/phrases-nb';

describe('Table plugin', () => {
  before(() => {
    setToken();
    editorRoutes();
    cy.visit('/subject-matter/learning-resource/new');
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
    cy.get('[data-slate-node=element] > p')
      .should('be.visible')
      .first()
      .click();
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[cy="slate-block-picker-menu"]').should('be.visible');
  });

  it('all table functions work', () => {
    cy.get('[data-cy=create-table]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el).type('{rightarrow}{downarrow}TEST{uparrow}TEST2{uparrow}TEST3', {
          force: true,
        });
        cy.get('[data-cy=column-add]').click({ force: true });
        cy.wrap($el).type('{rightarrow}Test new column');
        cy.get('[data-cy=row-add]').click({ force: true });
        cy.wrap($el).type('{downarrow}Test new row');
      });

    cy.get('[data-cy=column-remove]').click({ force: true });
    cy.get('[data-cy=row-remove]').click({ force: true });
    cy.contains(t.form.content.table['table-remove']).click({ force: true });
  });
});
