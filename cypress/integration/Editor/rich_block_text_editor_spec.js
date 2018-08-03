/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  beforeEachHelper('/subject-matter/learning-resource/new');
});

describe('Learning resource editing', () => {
  it('should be able to create a new learning resource', () => {
    cy.server();
    cy.fixture('saveLearningResource').as('saveResponse');
    cy.route({
      method: 'POST',
      url: `/draft-api/v1/drafts/`,
      status: 201,
      response: '@saveResponse',
    }).as('savedLR');

    cy.get('[data-cy=learning-resource-title]').type('This is a test title.');
    cy.get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .type('This is a test title. {enter}{rightarrow}', { release: false });
    cy.get('[data-testid=saveLearningResourceButton').click();
    cy.url().should('contain', 'subject-matter/learning-resource/9337/edit/nb');
  });
});
