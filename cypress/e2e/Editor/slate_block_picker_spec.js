/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

describe('can enter both element types SlateBlockPicker and SlateVisualElementPicker and add, remove, open and close them', () => {

  beforeEach(() => {
    setToken();
    editorRoutes();
    cy.visit('/subject-matter/learning-resource/new', { timeout: 20000 });
    cy.apiwait(['@zendeskToken','@getUserData','@getUsersResponsible','@licenses','@statusMachine']);
    cy.get('[data-slate-editor=true][contentEditable=true]').should('exist');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').first().focus();
    cy.get('[data-slate-node=element] > p').should('be.visible');
    cy.get('[data-slate-node=element] > p').click();
    cy.get('[data-cy=slate-block-picker]').should('exist');
    cy.get('[data-cy=slate-block-picker]').should('be.visible');
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[data-cy="slate-block-picker-menu"]').should('exist');
    cy.get('[data-cy="slate-block-picker-menu"]').should('be.visible');
  });

  it('adds and removes factAside', () => {
    cy.get('[data-cy="create-factAside"]').click();
    cy.get('[data-cy=remove-fact-aside]').should('be.visible');
    cy.get('[data-cy=remove-fact-aside]').click();
  });

  it('adds and removes table', () => {
    cy.get('[data-cy=create-table]').click();
    cy.get('[data-cy=table-remove]').should('be.visible');
    cy.get('[data-cy=table-remove]').click();
  });

  it('adds and removes bodybox', () => {
    cy.get('[data-cy=create-bodybox]').click();
    cy.get('[data-cy="remove-bodybox"]').should('be.visible');
    cy.get('[data-cy="remove-bodybox"]').click();
  });

  it('adds and removes details', () => {
    cy.get('[data-cy=create-details]').click();
    cy.get('[data-cy="remove-details"]').should('be.visible');
    cy.get('[data-cy="remove-details"]').click();
  });

  it('adds and removes grid', () => {
    cy.get('[data-cy=create-grid]').click();
    cy.get('[data-cy="remove-grid"]').should('be.visible');
    cy.get('[data-cy="remove-grid"]').click();
  });

  it('adds and removes code-block', () => {
    cy.get('[data-cy=create-code]').click();
    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.get('[data-cy="modal-body"]').within(() => {
      cy.get('input[type=text]').first().click().type('Title');
      cy.get('select').select('HTML');
      cy.get('textarea').first().click().type('Some <strong>markup</strong>{enter}Newline');
      cy.get('span').contains('Lagre').click();
    });
    cy.get('[data-cy="remove-code"]').should('be.visible');
    cy.get('[data-cy="remove-code"]').click();
  });

  it('opens and closes image', () => {
    cy.apiroute(
      'GET',
      '/image-api/v3/images/?fallback=true&language=nb&page=1&page-size=16',
      'editor/images/imageList',
    );
    cy.get('[data-cy=create-image]').click();
    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.apiwait('@editor/images/imageList');
    cy.get('[data-cy="close-modal-button"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('adds and removes image', () => {
    cy.apiroute(
      'GET',
      '/image-api/v3/images/?fallback=true&language=nb&page=1&page-size=16',
      'editor/images/imageList',
    );
    cy.apiroute('GET', '**/images/*?language=nb', 'editor/images/image');
    cy.get('[data-cy=create-image]').click();
    cy.apiwait('@editor/images/imageList');
    cy.get('[data-cy="select-image-from-list"]').first().click();
    cy.apiwait('@editor/images/image');
    cy.get('[data-cy="use-image"]').click();
    cy.get('[data-cy=remove-element]').should('be.visible');
    cy.get('[data-cy=remove-element]').click();
  });

  it('opens and closes video', () => {
    cy.apiroute('GET', '/get_brightcove_token', 'editor/videos/brightcoveToken');
    cy.apiroute('GET', '**/videos/**', 'editor/videos/videoListBrightcove');
    cy.get('[data-cy=create-video]').click();
    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.apiwait('@editor/videos/videoListBrightcove');
    cy.get('[data-cy="close-modal-button"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('adds and removes video-brightcove', () => {
    cy.apiroute('GET', '/get_brightcove_token', 'editor/videos/brightcoveToken');
    cy.apiroute('GET', '**/videos/**', 'editor/videos/videoListBrightcove');

    cy.get('[data-cy=create-video]').click();
    cy.apiwait(['@editor/videos/videoListBrightcove', '@editor/videos/brightcoveToken']);
    cy.get('[data-cy="use-video"]').first().click();
    cy.get('[data-cy="remove-element"]').click();
    cy.get('[data-cy="remove-element"]').should('not.exist');
    cy.get('[data-slate-node=element] > p').clear();
  });

  it('opens and closes podcast', () => {
    cy.apiroute(
      'GET',
      '/audio-api/v1/audio/?audio-type=podcast&language=nb&page=1&page-size=16&query=',
      'editor/audios/podcastList',
    );
    cy.apiroute('GET', '**/audio-api/v1/audio/*?language=nb', 'editor/audios/audio-1');
    cy.get('[data-cy=create-podcast]').click();
    cy.apiwait(['@editor/audios/podcastList', '@editor/audios/audio-1']);
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="close-modal-button"]').should('not.exist');
  });

  it('opens and closes audio', () => {
    cy.apiroute(
      'GET',
      '/audio-api/v1/audio/?audio-type=standard&language=nb&page=1&page-size=16&query=',
      'editor/audios/audioList',
    );
    cy.apiroute('GET', '**/audio-api/v1/audio/*?language=nb', 'editor/audios/audio-1');

    cy.get('[data-cy=create-audio]').click();
    cy.apiwait(['@editor/audios/audioList', '@editor/audios/audio-1']);

    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.get('[data-cy="close-modal-button"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes file', () => {
    cy.get('[data-cy=create-file]').click();
    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.get('[data-cy="close-modal-button"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes url', () => {
    cy.get('[data-cy=create-url]').click();
    cy.get('[data-cy="modal-header"]').should('exist');
    cy.get('[data-cy="modal-body"]').should('exist');
    cy.get('[data-cy="close-modal-button"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes related', () => {
    setToken();
    cy.apiroute('GET', '**/search-api/v1/search/editorial/*', 'search');

    cy.get('[data-cy=create-related]').click();
    cy.get('[data-tab-panel=""]').should('exist');
    cy.apiwait('@search');
    cy.get('[data-cy="close-related-button"]').should('be.visible');
    cy.get('[data-cy="close-related-button"]').click();
  });
});
