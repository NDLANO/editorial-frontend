/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { responsiblesMock, userDataMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {

    const licenses = mockRoute({
        page,
        path: '**/draft-api/v1/drafts/licenses/',
        fixture: 'search_content_licenses',
    });

    const subjects = mockRoute({
        page,
        path: '**/taxonomy/v1/resource-types?language=nb',
        fixture: 'search_content_subjects',
    });

    const resourceTypes = mockRoute({
        page,
        path: '**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT',
        fixture: 'search_content_resource_type'
    });

    const getEditors = mockRoute({
        page,
        path: '**/get_editors',
        fixture: 'search_content_get_editors',
        overrideValue: () => JSON.stringify([
            {
                name: 'Ed Test',
                app_metadata: {
                    ndla_id: 'PrcePFwCDOsb2_g0Kcb-maN0'
                }
            }]),
    })


    const searchcontent = mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1*',
        fixture: 'search_content_search'
    });

    const searchNextPage = mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=2*',
        fixture: 'search_content_next_search'
    });

    const zendesk = mockRoute({
        page,
        path: '**/get_zendesk_token',
        fixture: 'search_content_zendesk_token',
        overrideValue: JSON.stringify(zendeskMock),
    });

    const noteUsers = mockRoute({
        page,
        path: '**/get_note_users?*',
        fixture: 'search_content_note_users',
    });

    const userData = mockRoute({
        page,
        path: '**/draft-api/v1/user-data',
        fixture: 'search_content_user_data',
        overrideValue: JSON.stringify(userDataMock),
    });




    const responsibles = mockRoute({
        page,
        path: '**/get_responsibles*',
        fixture: 'search_content_responsibles',
        overrideValue: JSON.stringify(responsiblesMock),
    });


    const statusStateMachine = mockRoute({
        page,
        path: '**/content-api/v1/drafts/status-state-machine/',
        fixture: 'search_content_status_state_machine',
    });


    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');

    await Promise.all([
        licenses,
        statusStateMachine,
        resourceTypes,
        searchcontent,
        subjects,
        noteUsers,
        responsibles,
        zendesk,
        userData,
        searchNextPage,
        getEditors
    ]);
});


test('Can use text input', async ({ page }) => {
    await page.locator('input[name="query"]').fill('Test');
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&query=Test&sort=-lastUpdated',
        fixture: 'search_content_query_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&query=Test&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('1259');
    await page.locator('input[name="query"]').clear();
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use status dropdown', async ({ page }) => {
    await page.locator('select[name="status"]').selectOption({ index: 1 });
    await mockRoute({
        page,
        path: '**?draft-status=UNPUBLISHED&exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated',
        fixture: 'search_content_status_search',
    });
    await page.goto(
        '/search/content?draft-status=UNPUBLISHED&exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('144');
    await page.locator('select[name="draft-status"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use language dropdown', async ({ page }) => {
    await page.locator('select[name="language"]').selectOption({ index: 1 });
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&language=nb&page=*&page-size=10&sort=-lastUpdated',
        fixture: 'search_content_lang_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&language=nb&page=1&page-size=10&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('18909');
    await page.locator('select[name="language"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use subject dropdown', async ({ page }) => {
    await page.locator('select[name="subjects"]').selectOption({ label: 'Biologi 1' });
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated&subjects=urn%3Asubject%3A1%3A83ce68bc-19c9-4f2b-8dba-caf401428f21',
        fixture: 'search_content_subjects_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated&subjects=urn%3Asubject%3A1%3A83ce68bc-19c9-4f2b-8dba-caf401428f21',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('619');
    await page.locator('select[name="subjects"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use responsible dropdown', async ({ page }) => {
    await page.locator('select[name="responsible-ids"]').selectOption({ index: 1 });
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&responsible-ids=Gxfx7B-MXoFdgVZZ6p611C6w&sort=-lastUpdated',
        fixture: 'search_content_responsible_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&responsible-ids=Gxfx7B-MXoFdgVZZ6p611C6w&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21');
    await page.locator('select[name="responsible-ids"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use user dropdown', async ({ page }) => {
    await page.locator('select[name="users"]').selectOption({ index: 1 });
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated&users=%22Gxfx7B-MXoFdgVZZ6p611C6w%22',
        fixture: 'search_content_users_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated&users=Gxfx7B-MXoFdgVZZ6p611C6w',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('98');
    await page.locator('select[name="users"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use content type dropdown', async ({ page }) => {
    await page.locator('select[name="resource-types"]').selectOption({ index: 1 });
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&resource-types=urn%3Aresourcetype%3AworkAssignment&sort=-lastUpdated',
        fixture: 'search_content_content_type_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&resource-types=urn%3Aresourcetype%3AworkAssignment&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('547');
    await page.locator('select[name="users"]').selectOption({ index: 0 });
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});


test('Can use inactive checkbox', async ({ page }) => {
    await page.getByTestId('search-checkbox').locator('input[id="checkbox-filter-inactive"]').click();
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=false&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated',
        fixture: 'search_content_inactive_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=false&fallback=false&filter-inactive=false&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('37171');
    await page.getByTestId('search-checkbox').locator('input[id="checkbox-filter-inactive"]').click();
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});

test('Can use exclude checkbox', async ({ page }) => {
    await page.getByTestId('search-checkbox').locator('input[id="checkbox-exclude-revision-log"]').click();
    await mockRoute({
        page,
        path: '**/search-api/v1/search/editorial/?exclude-revision-log=false&fallback=false&filter-inactive=false&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated/search-api/v1/search/editorial/?exclude-revision-log=true&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated',
        fixture: 'search_content_exclude_search',
    });
    await page.goto(
        '/search/content?exclude-revision-log=true&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated',
    );
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
    await page.getByTestId('search-checkbox').locator('input[id="checkbox-exclude-revision-log"]').click();
    await page.goto('/search/content?page=1&page-size=10&sort=-lastUpdated');
    await page.getByTestId('content-search-result').first().waitFor();
    expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('21123');
});