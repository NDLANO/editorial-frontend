/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Subject editing', () => {
  /*   it('should have a list of clickable subjects loaded', () => {
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
 */

  const taxonomyResponse = {
    headers: {
      Location: 'newPath',
      'content-type': 'text/plain; charset=UTF-8',
    },
    response: '',
  };
  it('should have a settings menu where everything works', () => {
    cy.server();
    cy
      .get('#plumbContainer > div')
      .first()
      .then(div => {
        cy
          .route({
            method: 'PUT',
            url: `/taxonomy/v1/subjects/${div.attr('id')}`,
            status: 204,
            headers: {
              Location: 'newPath',
              'content-type': 'text/plain; charset=UTF-8',
            },
            response: '',
          })
          .as('newSubjectName');
      });
    cy
      .route({
        method: 'POST',
        url: '/taxonomy/v1/topics',
        status: 201,
        headers: {
          Location: 'newPath',
          'content-type': 'text/plain; charset=UTF-8',
        },
        response: '',
      })
      .as('addNewTopic');
    cy
      .route({
        method: 'POST',
        url: '/taxonomy/v1/subject-topics',
        status: 201,
        headers: {
          Location: 'newPath',
          'content-type': 'text/plain; charset=UTF-8',
        },
        response: '',
      })
      .as('addNewSubjectTopic');
    cy
      .get('#plumbContainer > div > a')
      .first()
      .click();
    cy
      .get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@newSubjectName');
    cy
      .get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=addSubjectTopicButon]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@addNewTopic');
    cy.wait('@addNewSubjectTopic');
    cy
      .get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=addExistingSubjectTopicButton]').click();
    cy.get('[data-testid=inlineDropdownInput]').type('F{downarrow}{enter}');
    cy.get('[data-testid=inlineEditSaveButton]').click();
    cy.wait('@addNewSubjectTopic');
    cy
      .get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=editSubjectFiltersButton]').click();
    cy.get('[data-testid=addFilterButton]').click();
    cy.get('[data-testid=addFilterInput]').type('cypress-test-filter{enter}');
    cy
      .get('div')
      .contains('cypress-test-filter')
      .find('button')
      .first()
      .click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy
      .get('div')
      .contains('cypress-test-filterTEST')
      .find('button')
      .last()
      .click();
    cy.get('[data-testid=warningModalConfirm]').click();
  });
});
