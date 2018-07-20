/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Subject editing', () => {
  it('should have a list of clickable subjects loaded', () => {
    cy.get('#plumbContainer > div > a').each($el => {
      cy.wrap($el).click();
      cy.location().should(loc => {
        expect(loc.pathname).to.include('subject');
      });
    });
  });

  it('adds a new subject', () => {
    cy.server();
    cy.route('POST', '/taxonomy/v1/subjects', {
      headers: { Location: 'newPath' },
    });
    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Testfag{enter}');
    cy.get('[data-testid=AddSubjectButton]');
  });

  it('should have a settings menu where everything works', () => {
    cy
      .get('#plumbContainer > div > a')
      .first()
      .click();
    cy
      .get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=changeSubjectNameButton]').click();
  });
});
