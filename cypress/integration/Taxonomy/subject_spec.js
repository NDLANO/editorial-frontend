/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Subject editing', () => {
  beforeEach(() => {
    setToken();
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return (
          xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
        );
      },
    });

    cy.apiroute('GET', '/taxonomy/v1/subjects?includeMetadata=true&language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?includeMetadata=true&recursive=true',
      'allSubjectTopics',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/filters',
      'allSubjectFilters',
    );
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/subjects',
      headers: {
        Location: 'newPath',
      },
      response: '',
    }).as('addSubject');

    cy.route({
      method: 'PUT',
      url: `/taxonomy/v1/subjects/urn:subject:12`,
      status: 204,
      response: '',
      headers: {
        Location: 'newPath',
      },
    }).as('newSubjectName');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topics',
      status: 201,
      response: '',
      headers: {
        Location: 'newPath',
      },
    }).as('addNewTopic');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/filters',
      status: 201,
      response: '',
      headers: { Location: 'filterPath' },
    }).as('addFilter');
    cy.route({
      method: 'PUT',
      url:
        '/taxonomy/v1/filters/urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce',
      status: 204,
      response: '',
    }).as('editFilter');
    cy.route({
      method: 'DELETE',
      url:
        '/taxonomy/v1/filters/urn:filter:d9bdcc01-b727-4b5a-abdb-3e4936e554ce',
      response: '',
      status: 204,
    }).as('deleteFilter');
    cy.apiroute('GET', '/taxonomy/v1/topics?includeMetadata=true&language=nb', 'allTopics');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topic-filters',
      status: 201,
      response: '',
      headers: {
        Location: 'filterPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
    });
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/subject-topics',
      status: 201,
      response: '',
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
    }).as('addNewSubjectTopic');
    cy.visit('/structure/urn:subject:12', visitOptions);
    cy.wait(['@allSubjects', '@allSubjectTopics', '@allSubjectFilters']);
  });

  it('should add a new subject', () => {
    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type(
      'Cypress test subject{enter}',
    );
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.get('[data-testid=changeSubjectNameButton]').click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@newSubjectName');

    cy.get('[data-cy=settings-button-subject]')
      .first()
      .click();
    cy.get('[data-testid=editSubjectFiltersButton]').click();
    cy.get('[data-testid=addFilterButton]').click();
    cy.get('[data-testid=addFilterInput]').type('cypress-test-filter{enter}');
    cy.wait('@addFilter');

    cy.get('[data-testid=editFilterBox] > div')
      .find('button')
      .first()
      .click();
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}');
    cy.wait('@editFilter');
    cy.get('[data-testid=editFilterBox] > div')
      .first()
      .find('[data-testid=deleteFilter]')
      .click();
    cy.wait(500);
    cy.get('[data-testid=warningModalConfirm]').click();
    cy.wait('@deleteFilter');
  });
});
