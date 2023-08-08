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

const metaKey = process.platform === 'darwin' ? 'Meta' : 'Control';

test.beforeEach(async ({ page }) => {
    const zendesk = await mockRoute({
        page,
        path: '**/get_zendesk_token',
        fixture: 'math_zendesk_token',
        overrideValue: JSON.stringify(zendeskMock),
    });

    const responsibles = await mockRoute({
        page,
        path: '**/get_responsibles?permission=drafts:responsible',
        fixture: 'math_responsibles',
        overrideValue: JSON.stringify(responsiblesMock),
    });

    const licenses = await mockRoute({
        page,
        path: '**/draft-api/v1/drafts/licenses/',
        fixture: 'math_licenses',
    });

    const statuses = await mockRoute({
        page,
        path: '**/draft-api/v1/drafts/status-state-machine/',
        fixture: 'math_status_state_machine',
    });

    await page.goto('/subject-matter/learning-resource/new');

    await Promise.all([zendesk, responsibles, licenses, statuses]);


    const el = page.locator('[data-cy="slate-editor"]');
    await el.click();
    await el.type('111+1');
    await el.press(`${metaKey}+A`);
    await page.getByTestId('toolbar-button-mathml').click();

});


test('editor is visible', async ({ page }) => {
    const mathEditor = page.locator('[data-cy="modal-body"]').getByRole('application');
    await mathEditor.waitFor();
    await expect(mathEditor).toBeVisible();
});

test('contains text from slate editor', async ({ page }) => {
    const mathEditor = page.locator('[data-cy="modal-body"]').getByRole('application');
    await mathEditor.waitFor();
    expect((await mathEditor.locator('[class="wrs_container"]').textContent())?.slice(1)).toEqual('111+1');
});


test('can change text and save', async ({ page }) => {
    const mathEditor = page.locator('[data-cy="modal-body"]').getByRole('application');
    await mathEditor.waitFor();
    await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole('textbox').click();
    await page.keyboard.type("=112");
    expect((await mathEditor.locator('[class="wrs_container"]').textContent())?.slice(1)).toEqual('111+1=112');
    await page.getByTestId('save-math').click();
    await expect(page.getByTestId('math')).toBeVisible();
    expect(await page.getByTestId('math').textContent()).toEqual('111+1=112')
});

test('can change preview when preview button pressed', async ({ page }) => {
    const mathEditor = page.locator('[data-cy="modal-body"]').getByRole('application');
    await mathEditor.waitFor();
    expect(await page.getByTestId('preview-math-text').textContent()).toEqual('111+1');
    await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole('textbox').click();
    await page.keyboard.type("=112");
    expect((await mathEditor.locator('[class="wrs_container"]').textContent())?.slice(1)).toEqual('111+1=112');
    await page.getByTestId('preview-math').click();
    expect(await page.getByTestId('preview-math-text').textContent()).toEqual('111+1=112');
})


test('can provide modal when leaving unchecked edits', async ({ page }) => {
    const mathEditor = page.locator('[data-cy="modal-body"]').getByRole('application');
    await mathEditor.waitFor();
    await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole('textbox').click();
    await page.keyboard.type("=112");
    await page.getByTestId('abort-math').click();
    await expect(page.getByTestId('alert-modal')).toBeVisible()
})