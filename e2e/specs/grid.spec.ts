/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { responsiblesMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
    const zendesk = await mockRoute({
        page,
        path: '**/get_zendesk_token',
        fixture: 'grid_zendesk_token',
        overrideValue: JSON.stringify(zendeskMock),
    });

    const responsibles = await mockRoute({
        page,
        path: '**/get_responsibles?permission=drafts:responsible',
        fixture: 'grid_responsibles',
        overrideValue: JSON.stringify(responsiblesMock),
    });

    const licenses = await mockRoute({
        page,
        path: '**/draft-api/v1/drafts/licenses/',
        fixture: 'grid_licenses',
    });

    const statuses = await mockRoute({
        page,
        path: '**/draft-api/v1/drafts/status-state-machine/',
        fixture: 'grid_status_state_machine',
    });

    await Promise.all([zendesk, responsibles, licenses, statuses]);

    await page.goto('/subject-matter/learning-resource/new');
    await page.locator('[data-cy="slate-editor"]').click();
    await page.locator('[data-cy="slate-block-picker"]').click();
    await page.locator('[data-cy="create-grid"]').click();
});

test('can select multiple different sizes', async ({ page }) => {
    expect(await page.getByTestId('slate-grid-cell').count()).toEqual(2)
    await page.getByTestId('edit-grid-button').click();
    await page.getByRole('radiogroup').getByText('4').click();
    await page.getByRole('button', { name: 'Lagre', exact: true }).click();
    expect(await page.getByTestId('slate-grid-cell').count()).toEqual(4)
    await page.getByTestId('edit-grid-button').click();
    await page.getByRole('radiogroup').getByText('2x2').click();
    await page.getByRole('button', { name: 'Lagre', exact: true }).click();
    expect(await page.getByTestId('slate-grid-cell').count()).toEqual(4)
    await page.getByTestId('edit-grid-button').click();
    await page.getByRole('radiogroup').getByText('2', { exact: true }).click();
    await page.getByRole('button', { name: 'Lagre', exact: true }).click();
    expect(await page.getByTestId('slate-grid-cell').count()).toEqual(2)
});

test('can change background color', async ({ page }) => {
    await page.getByTestId('edit-grid-button').click();
    await page.getByText('Hvit').click();
    await page.getByRole('button', { name: 'Lagre', exact: true }).click();
    await expect(page.locator('div[data-background="white"]')).toBeVisible();
});

test('can set border', async ({ page }) => {
    await page.getByTestId('edit-grid-button').click();
    await page.getByRole('checkbox').setChecked(true);
    await page.getByRole('button', { name: 'Lagre', exact: true }).click();
    await page.getByTestId('edit-grid-button').click();
    await expect(page.getByRole('checkbox').isChecked()).toBeTruthy();
});

test('can enable parallax on cells', async ({ page }) => {
    expect(await page.getByTestId('grid-cell-parallax').count()).toEqual(2);
    await expect(page.getByTitle('Lås innhold til cellen ved siden av', { exact: true }).first()).toBeVisible();
    await page.getByTitle('Lås innhold til cellen ved siden av', { exact: true }).first().click();
    await expect(page.getByTitle('Frigjør innhold fra cellen ved siden av', { exact: true }).first()).toBeVisible();
})