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
    cy.get('[data-cy=learning-resource-title]').type('This is a test title.');
    const slateEditor = cy.get('[data-cy=slate-editor] div').first();

    slateEditor.focus().type('This is a test title. {enter}{rightarrow}', {release: false});
  });
});
