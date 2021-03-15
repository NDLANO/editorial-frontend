/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

describe('Subject editing', () => {
  before(() => {
    setToken();
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url);
      },
    });

    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/urn:subject:12/topics?recursive=true&language=nb',
      'allSubjectTopics',
    );
    cy.apiroute('GET', '/taxonomy/v1/subjects/urn:subject:12/filters', 'allSubjectFilters');

    cy.visit('/structure/urn:subject:12', visitOptions);
    cy.wait(['@allSubjects', '@allSubjectTopics', '@allSubjectFilters']);
  });

  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
  });

  it('should add a new subject', () => {
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/subjects',
      status: 201,
      headers: {
        Location: 'newPath',
      },
      response: '',
    }).as('addSubject');

    cy.get('[data-testid=AddSubjectButton]').click();
    cy.get('[data-testid=addSubjectInputField]').type('Cypress test subject{enter}');
    cy.wait('@addSubject');
  });

  it('should have a settings menu where everything works', () => {
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
      url: '/taxonomy/v1/filters/urn:filter:df8344b6-ad86-44be-b6b2-d61b3526ed29',
      status: 204,
      response: '',
    }).as('editFilter');
    cy.route({
      method: 'DELETE',
      url: '/taxonomy/v1/filters/urn:filter:df8344b6-ad86-44be-b6b2-d61b3526ed29',
      response: '',
      status: 204,
    }).as('deleteFilter');
    cy.apiroute('GET', '/taxonomy/v1/topics?language=nb', 'allTopics');
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
