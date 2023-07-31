/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const filmFrontpage = mockRoute({
    page,
    path: '**/frontpage-api/v1/filmfrontpage',
    fixture: 'film_filmfrontpage',
  });

  const allMovies = mockRoute({
    page,
    path: '**/search-api/v1/search/*',
    fixture: 'film_all_movies',
  });

  const zendeskToken = mockRoute({
    page,
    path: '/get_zendesk_token',
    fixture: 'film_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  await page.goto('/film');

  await Promise.all([filmFrontpage, allMovies, zendeskToken]);
});

test('Can add a movie to the slideshow', async ({ page }) => {
  await page.getByTestId('dropdownInput').first().click();
  await page.keyboard.type('Brukerstøtte');
  await page.getByTestId('dropdown-items').locator('[id="downshift-1-item-0"]').click();
  await page.getByTestId('elementListItem').getByRole('img').first().click();
});

test('Can remove movie from slideshow', async ({ page }) => {
  await expect(page.getByTestId('elementListItem').filter({ hasText: 'Catfish' })).toBeVisible();
  await page
    .getByTestId('elementListItem')
    .filter({ hasText: 'Catfish' })
    .getByTestId('elementListItemDeleteButton')
    .click();
  await expect(page.getByTestId('elementListItem').filter({ hasText: 'Catfish' })).toBeVisible({
    visible: false,
  });
});

test('Can add theme', async ({ page }) => {
  await page.getByTestId('add-theme-modal').click();
  await page.keyboard.type('Ny testgruppe');
  await page.getByRole('button', { name: 'Opprett gruppe' }).click();
  await expect(page.getByRole('heading', { name: 'Ny testgruppe' })).toBeVisible();
});
