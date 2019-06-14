/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nock from 'nock';
import { transformUrlIfNeeded } from '../VisualElementUrlPreview';

test('transformUrlIfNeeded returns static nrk url if correct nrk url is used', async () => {
  nock('http://nrk-api')
    .get('/api/1.0/media/23618')
    .reply(200, { psId: '33' });
  const url = await transformUrlIfNeeded(
    'https://www.nrk.no/skole/?mediaId=23618',
  );

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns url sent in if nrk api should return undefined', async () => {
  nock('http://nrk-api')
    .get('/api/1.0/media/23618')
    .reply(200);
  const url = await transformUrlIfNeeded(
    'https://www.nrk.no/skole/?mediaId=23618',
  );

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns url sent in if nrk api should return something else', async () => {
  nock('http://nrk-api')
    .get('/api/1.0/media/23618')
    .reply(200, { somethingElse: 'test' });
  const url = await transformUrlIfNeeded(
    'https://www.nrk.no/skole/?mediaId=23618',
  );

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns same url if not from nrk', async () => {
  const url = await transformUrlIfNeeded('https://somerandomurl.com');

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded does not crash without url', async () => {
  const url = await transformUrlIfNeeded();

  expect(url).toMatchSnapshot();
});
