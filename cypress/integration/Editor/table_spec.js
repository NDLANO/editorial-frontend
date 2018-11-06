/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';
import t from '../../../src/phrases/phrases-nb';

beforeEach(() => beforeEachHelper('/subject-matter/learning-resource/new'));

describe('Learning resource editing', () => {
  it('can enter all types of blocks', () => {
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus();
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-table]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .then($el => {
        cy.wrap($el).type('{downarrow}TEST{rightarrow}TEST2{downarrow}TEST3', {
          force: true,
        });
        cy.get('[data-cy=column-add]').click({ force: true });
        cy.wrap($el).type('Test new column');
        cy.get('[data-cy=row-add]').click({ force: true });
        cy.wrap($el).type('Test new row');
      });

    cy.get('[data-cy=column-remove]').click({ force: true });
    cy.get('[data-cy=row-remove]').click({ force: true });
    cy.contains(t.form.content.table['table-remove']).click({ force: true });
  });
});
