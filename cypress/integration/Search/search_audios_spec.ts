/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';

describe('Search audios', () => {
  beforeEach(() => {
    setToken();
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.apiroute('GET', '/taxonomy/v1/subjects?language=nb', 'allSubjects');
    cy.apiroute('GET', '/audio-api/v1/audio/?page=1&page-size=10&sort=-relevance', 'searchAudios');
    cy.apiroute('GET', '/get_zendesk_token', 'zendeskToken');
    cy.visit('/search/audio?page=1&page-size=10&sort=-relevance');
    cy.apiwait(['@licenses', '@searchAudios', '@allSubjects', '@zendeskToken']);
  });

  it('Can use text input', () => {
    cy.apiroute('GET', '**/audio-api/v1/audio/?*query=Test*', 'searchAudioQuery');
    cy.get('input[name="query"]')
      .type('Test')
      .blur();
    cy.apiwait(['@searchAudioQuery']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('input[name="query"]').clear();
    cy.apiwait(['@searchAudios']);
  });

  it('Can use audiotype dropdown', () => {
    cy.apiroute('GET', '**/audio-api/v1/audio/?audio-type=podcast*', 'searchAudioType');
    cy.get('select[name="audio-type"]')
      .select('Podkast')
      .blur();
    cy.apiwait(['@searchAudioType']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="audio-type"]').select('Velg lydfiltype');
    cy.apiwait(['@searchAudios']);
  });

  it('Can use language dropdown', () => {
    cy.apiroute('GET', '**/audio-api/v1/audio/?language=en*', 'searchAudioLang');
    cy.get('select[name="language"]')
      .select('Engelsk')
      .blur();
    cy.apiwait(['@searchAudioLang']);
    cy.get('span[data-cy="totalCount"').contains(/^Antall søketreff: \d+/);
    cy.get('select[name="language"]').select('Velg språk');
    cy.apiwait(['@searchAudios']);
  });
});
