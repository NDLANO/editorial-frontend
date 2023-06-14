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
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
    cy.get('[data-slate-node=element] > p').clear();
    cy.get('[data-slate-node=element] > p').should('exist');
    cy.get('[data-slate-node=element] > p').should('be.visible').first().click().clear();
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[data-cy="slate-block-picker-menu"]').should('be.visible');
  });

  it('all table functions work', () => {
    cy.get('[data-cy=create-table]').last().click();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .then(($el) => {
        cy.wrap($el).type(
          'TITTEL{rightarrow}{downarrow}{downarrow}TEST{uparrow}TEST2{uparrow}TEST3',
          {
            force: true,
          },
        );
        cy.get('[data-cy=column-add]').click();
        cy.wrap($el).type('{rightarrow}Test new column');
        cy.get('[data-cy=row-remove]').click();
        cy.get('[data-cy=head-add]').click();
        cy.wrap($el).type('{uparrow}Test new header{downarrow}');
        cy.get('[data-cy=row-add]').click();
        cy.wrap($el).type('{downarrow}Test new row');
        cy.get('[data-cy=toggle-row-headers]').click();
      });

    cy.get('[data-cy=column-remove]').click();
    cy.get('[data-cy=row-remove]').click();
    cy.get('[data-cy=table-remove]').click();
  });
});
