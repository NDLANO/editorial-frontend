/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {setToken, visitOptions} from "../../support";

describe("can enter both element types SlateBlockPicker and SlateVisualElementPicker and add, remove, open and close them", () => {

  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.visit('/subject-matter/learning-resource/new', visitOptions);

    cy.get('[cy="slate-block-picker-menu"]').should('not.be.visible');
    cy.get('[data-slate-object=block] > p').first().click();
    cy.get('[data-cy=slate-block-picker]').click();
    cy.get('[cy="slate-block-picker-menu"]').should('be.visible');
  });

  afterEach( () => {
    cy.get('[data-cy="learning-resource-title"]').focus();
    cy.get('[cy="slate-block-picker-button"]').should('have.css', 'z-index', '-1');
  });

  it('adds and removes factAside', () => {
    cy.get('[data-cy="create-factAside"]').click();
    cy.get('[data-cy=remove-fact-aside]').click();
  });

  it('adds and removes table', () => {
    cy.get('[data-cy=create-table]').click();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').focus();
    cy.get('[data-cy=table-remove]').click();
  });

  it('adds and removes bodybox', () => {
    cy.get('[data-cy=create-bodybox]').click();
    cy.get('[data-cy="remove-bodybox"]').click();
  });

  it('adds and removes details', () => {
    cy.get('[data-cy=create-details]').click();
    cy.get('[data-cy="remove-details"]').click();
  });

  it('opens and closes image', () => {
    cy.get('[data-cy=create-image]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('adds and removes image', () => {
    cy.route(
      'GET',
      '/image-api/v2/images/?page=1&page-size=16',
      'fixture:editor/imageSearch.json',
    );

    cy.route(
      'GET',
      '/image-api/v2/images/26817?language=nb',
      'fixture:editor/images/image:26817.json',
    );

    cy.get('[data-cy=create-image]').click();
    cy.get('[data-cy="select-image-from-list"]').first().click();
    cy.get('[data-cy="use-image"]').click();
    cy.get('[data-cy=remove-element]').click();
  });

  it('opens and closes video', () => {
    cy.get('[data-cy=create-video]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('adds and removes video-brightcove', () => {
    cy.route(
      'GET',
      '*.brightcove/**',
      'fixture:editor/a.json');

    cy.get('[data-cy=create-video]').click();
    cy.get('[data-cy="use-video"]').first().click();
    cy.get('[data-cy="remove-element"]').click();
  });

  it('adds and removes video-youtube', () => {
    cy.route(
      'GET',
      '**/customsearch/**',
      'fixture:editor/videos/video:items.json',
    );

    cy.route(
      'GET',
      '**/oembed-proxy/**',
      'fixture:editor/videos/video:linkinpark.json',
    );

    cy.get('[data-cy=create-video]').click();
    cy.get('[data-cy="YouTube-video-tab"]').click();
    cy.get('[data-cy="use-video"]').first().click();
    cy.get('[data-cy="remove-element"]').click();
  });

  it('opens and closes audio', () => {
    cy.get('[data-cy=create-audio]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes H5P', () => {
    cy.get('[data-cy=create-h5p]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes url', () => {
    cy.get('[data-cy=create-url]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes file', () => {
    cy.get('[data-cy=create-file]').click();
    cy.get('[data-cy="modal-header"]').should('be.visible');
    cy.get('[data-cy="modal-body"]').should('be.visible');
    cy.get('[data-cy="close-modal-button"]').click();
  });

  it('opens and closes related', () => {
    cy.get('[data-cy=create-related]').click();
    cy.get('[data-cy="styled-article-modal"]').should('be.visible');
    cy.get('[data-cy="close-related-button"]').click();
  });

});