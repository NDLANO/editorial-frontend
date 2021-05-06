/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import t from '../../../src/phrases/phrases-nb';

describe('Table plugin', () => {
  beforeEach(() => {
    setToken();
    cy.visit('/subject-matter/learning-resource/new', visitOptions);
  });

  it('all table functions work', () => {
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus();
    cy.wait(500);
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.wait(500);

    cy.get('[data-cy=create-table]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .wait(500)
      .then($el => {
        cy.wrap($el).type(
          '{uparrow}{uparrow}{leftarrow}TEST{rightarrow}TEST2{downarrow}TEST3',
          {
            force: true,
          },
        );
        cy.get('[data-cy=column-add]').click({ force: true });
        cy.wait(500);
        cy.wrap($el).type('Test new column');
        cy.wait(500);
        cy.get('[data-cy=row-add]').click({ force: true });
        cy.wait(500);
        cy.wrap($el).type('Test new row');
      });

    cy.get('[data-cy=column-remove]').click({ force: true });
    cy.get('[data-cy=row-remove]').click({ force: true });
    cy.contains(t.form.content.table['table-remove']).click({ force: true });
  });
});
