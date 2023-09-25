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
    path: '**/frontpage-api/v1/filmfrontpage/',
    fixture: 'film_frontpage',
  });

  const allMovies = mockRoute({
    page,
    path: '**/search-api/v1/search/*',
    fixture: 'film_all_movies',
  });

  const zendeskToken = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'film_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  await page.goto('/film');

  await Promise.all([filmFrontpage, allMovies, zendeskToken]);
});

test('Can add a movie to the slideshow', async ({ page }) => {
  await page.getByTestId('dropdown-input').first().fill('Brukerstøtte');
  await page.getByTestId('dropdown-items').getByText('Brukerstøtte').first().click();
  await page.getByTestId('dropdown-items').blur();
});

test('Can remove movie from list', async ({ page }) => {
  await page.unroute('**/frontpage-api/v1/filmfrontpage');
  await mockRoute({
    page,
    path: '**/frontpage-api/v1/filmfrontpage/',
    fixture: 'film_frontpage_update',
  });
  await expect(
    page.getByTestId('elementListItem').filter({ hasText: 'Brukerstøtte' }),
  ).toBeVisible();
  await page
    .getByTestId('elementListItem')
    .filter({ hasText: 'Brukerstøtte' })
    .getByTestId('elementListItemDeleteButton')
    .click();
  await expect(page.getByTestId('elementListItem').filter({ hasText: 'Brukerstøtte' })).toBeVisible(
    {
      visible: false,
    },
  );
});

test('Can add theme', async ({ page }) => {
  await page.getByTestId('add-theme-modal').click();
  await page.keyboard.type('Ny testgruppe');
  await page.getByRole('button', { name: 'Opprett gruppe' }).click();
  await expect(page.getByRole('heading', { name: 'Ny testgruppe' })).toBeVisible();
});

test('Can save changes with new data', async ({ page }) => {
  await page.getByTestId('add-theme-modal').click();
  await page.keyboard.type('Testgruppe');
  await page.getByRole('button', { name: 'Opprett gruppe' }).click();
  await page
    .getByRole('combobox')
    .getByPlaceholder('Legg til film i "Testgruppe"')
    .fill('Brukerstøtte');
  await page.getByTestId('dropdown-items').getByText('Brukerstøtte').first().click();
  await page.getByTestId('dropdown-items').blur();
  await page.unroute('**/frontpage-api/v1/filmfrontpage');
  await mockRoute({
    page,
    path: '**/frontpage-api/v1/filmfrontpage/',
    fixture: 'film_frontpage_update',
  });
  await page.getByRole('button', { name: 'Lagre' }).click();
  await expect(
    page.getByTestId('elementListItem').filter({ hasText: 'Brukerstøtte' }),
  ).toBeVisible();
  await page.waitForTimeout(700);
  await page.getByTestId('deleteThemeButton').last().click();

  await page.unroute('**/frontpage-api/v1/filmfrontpage');
  await mockRoute({
    page,
    path: '**/frontpage-api/v1/filmfrontpage/',
    fixture: 'film_frontpage',
  });
  await page.getByRole('button', { name: 'Lagre' }).click();
  await page.waitForTimeout(700);
  await expect(page.getByTestId('elementListItem').filter({ hasText: 'Brukerstøtte' })).toBeVisible(
    {
      visible: false,
    },
  );
});
