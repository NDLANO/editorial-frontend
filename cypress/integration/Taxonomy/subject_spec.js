/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  cy.server({ force404: true });
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/?language=nb',
    'fixture:allSubjects.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true',
    'fixture:allSubjectTopics.json',
  );
  cy.route(
    'GET',
    '/taxonomy/v1/subjects/urn:subject:12/filters',
    'fixture:allSubjectFilters.json',
  );
  beforeEachHelper('/structure/subject:12');
});

describe('Subject editing', () => {
  it('should add a new subject', () => {
    cy.server({
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
    });
    cy.route('POST', '/taxonomy/v1/subjects', '').as('addSubject');

    cy.route('GET', '/taxonomy/v1/subjects/?language=nb', []);
    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type(
      'Cypress test subject{enter}',
    );
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.server({
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
    });
    cy.route({
      method: 'PUT',
      url: `/taxonomy/v1/subjects/urn:subject:12`,
      status: 204,
      response: '',
    }).as('newSubjectName');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topics',
      status: 201,
      response: '',
    }).as('addNewTopic');
    cy.route('POST', '/taxonomy/v1/filters', '');
    cy.route({
      method: 'PUT',
      url: '/taxonomy/v1/filters/urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554',
      status: 204,
      response: '',
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
      },
    });
    cy.route(
      'DELETE',
      '/taxonomy/v1/filters/urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554',
      '',
    );
    cy.route(
      'GET',
      '/taxonomy/v1/topics/?language=nb',
      'fixture:allTopics.json',
    );
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/subject-topics',
      status: 201,
      response: '',
    }).as('addNewSubjectTopic');

    cy.get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@newSubjectName');
    cy.get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=addSubjectTopicButon]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@addNewTopic');
    cy.wait('@addNewSubjectTopic');
    cy.get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=addExistingSubjectTopicButton]').click();
    cy.get('[data-testid=inlineDropdownInput]').type('F');
    cy.get('[data-testid=dropdown-items]')
      .first()
      .click();
    cy.get('[data-testid=inlineEditSaveButton]').click();
    cy.wait('@addNewSubjectTopic');
    cy.get('.c-settingsMenu')
      .first()
      .click();
    cy.get('[data-testid=editSubjectFiltersButton]').click();
    cy.get('[data-testid=addFilterButton]').click();
    cy.get('[data-testid=addFilterInput]').type('cypress-test-filter{enter}');
    cy.get('[data-testid=editFilterBox] > div')
      .find('button')
      .first()
      .click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.get('[data-testid=editFilterBox] > div')
      .first()
      .find('[data-testid=deleteFilter]')
      .click();
    cy.get('[data-testid=warningModalConfirm]').click();
  });
});
