/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import phrases from '../../../src/phrases/phrases-nb';

const selectSubject = 'urn:subject:12';
const selectTopic = 'urn:topic:1:183043';

describe('Topic editing', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/taxonomy/v1/subjects/?language=nb', 'allSubjects');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/subjects/${selectSubject}/topics?recursive=true`,
      'allSubjectTopics',
    ).as('subjectTopics');
    cy.apiroute(
      'GET',
      `/taxonomy/v1/subjects/${selectSubject}/filters`,
      'allSubjectFilters',
    );
    cy.apiroute(
      'GET',
      '/taxonomy/v1/resource-types/?language=nb',
      'resourceTypes',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:core&filter=`,
      'coreResources',
    );
    cy.apiroute(
      'GET',
      `/taxonomy/v1/topics/${selectTopic}/resources/?language=nb&relevance=urn:relevance:supplementary&filter=`,
      'supplementaryResources',
    );
    cy.apiroute('GET', '/article-api/v2/articles/8497', 'article');
    cy.route({
      method: 'PUT',
      url: `/taxonomy/v1/topics/${selectTopic}`,
      status: 204,
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    }).as('changeTopicName');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topics',
      status: 201,
      headers: {
        Location: 'newPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    });
    cy.route({
      method: 'POST',
      status: 201,
      url: '/taxonomy/v1/topic-subtopics',
      headers: {
        Location: 'newSubTopicPath',
        'content-type': 'text/plain; charset=UTF-8',
      },
      response: '',
    });
    cy.apiroute('/taxonomy/v1/topics/?language=nb', 'allTopics');
    cy.apiroute(`/taxonomy/v1/topics/${selectTopic}/filters`, 'topicFilters');
    cy.route({
      method: 'POST',
      url: '/taxonomy/v1/topic-filters',
      headers: {
        Location: 'filterLocation',
        'content-type': 'text/plain; charset=UTF-8',
      },
      status: 201,
      response: '',
    }).as('addToFilter');

    cy.visit(`/structure/${selectSubject}/${selectTopic}`, visitOptions);
  });

  it('should have a settings menu where everything works', () => {
    cy.wait('@subjectTopics');
    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('[data-cy=change-topic-name]').click({ force: true });
    cy.get('[data-testid=inlineEditInput]').type('TEST{enter}', {
      force: true,
    });
    cy.wait('@changeTopicName');

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.addTopic)
      .click();
    cy.get(`input[placeholder="${phrases.taxonomy.newTopic}"]`).type(
      'Nytt testemne{enter}',
    );

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.addExistingTopic)
      .click();
    cy.get(`input[placeholder="${phrases.taxonomy.existingTopic}"]`).type('F');
    cy.wait('@allTopics');
    cy.get('[data-testid=dropdown-items]')
      .contains('Filmanalyse')
      .click();

    cy.get('[data-cy=settings-button-topic]').click();
    cy.get('button')
      .contains(phrases.taxonomy.connectFilters)
      .click();
    cy.get('[data-cy=connectFilterItem] > label').each($lbl => {
      cy.wrap($lbl).click();
    });

    cy.get('[data-testid="submitConnectFilters"]').click();

    cy.wait('@addToFilter');
    cy.get('button')
      .contains(phrases.alertModal.delete)
      .click();
    cy.route({
      method: 'DELETE',
      url:
        '/taxonomy/v1/subject-topics/urn:subject-topic:2357d45d-1f79-4953-86e8-b97617a493d0',
      status: 204,
      response: '',
    });
    cy.get('[data-testid=confirmDelete]').click({
      force: true,
    });
  });
});
