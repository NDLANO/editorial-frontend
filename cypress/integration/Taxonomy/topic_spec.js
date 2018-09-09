/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  beforeEachHelper('/structure');
  cy.get('#plumbContainer > div > a')
    .first()
    .click();
  cy.get('[data-cy=subFolders] > div > div > div > a')
    .first()
    .click();
});

describe('Topic editing', () => {
  it('should have a settings menu where everything works', () => {
    cy.server(); // make sure no requests actually reach the server
    cy.get('[data-cy=subFolders] [data-cy=folderWrapper]')
      .first()
      .then(div => {
        cy.route({
          method: 'PUT',
          url: `/taxonomy/v1/topics/${div
            .attr('id')
            .split('/')
            .pop()}`,
          status: 204,
          headers: {
            Location: 'newPath',
            'content-type': 'text/plain; charset=UTF-8',
          },
          response: '',
        }).as('changeTopicName');
      });

    cy.get('[data-cy=settings-button-topic]').click({ force: true });
    cy.get('[data-cy=change-topic-name]').click({ force: true });
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}', {
      force: true,
    });
    cy.wait('@changeTopicName');
  });
});
