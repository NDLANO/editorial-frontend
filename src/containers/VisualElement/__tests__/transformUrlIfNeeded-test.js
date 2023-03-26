/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import nock from 'nock';
import { urlTransformers } from '../urlTransformers';

const transformUrlIfNeeded = async url => {
  for (const rule of urlTransformers) {
    if (rule.shouldTransform(url, rule.domains)) {
      return await rule.transform(url);
    }
  }
  return url;
};

test('transformUrlIfNeeded returns static nrk url if correct nrk url is used', async () => {
  nock('http://nrk-api')
    .get('/skole/api/media/23618')
    .reply(200, { psId: '33' });
  const url = await transformUrlIfNeeded('https://www.nrk.no/skole-deling/23618');

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns url sent in if nrk api should return undefined', async () => {
  nock('http://nrk-api')
    .get('/skole/api/media/23618')
    .reply(200);
  const url = await transformUrlIfNeeded('https://www.nrk.no/skole-deling/23618');

  expect(url).toMatchSnapshot();
});

test('transformurlifNeeded returns static nrk url for old nrk embed format', async () => {
  nock('http://nrk-api')
    .get('/skole/api/media/23618')
    .reply(200, { psId: '33' });
  const url = await transformUrlIfNeeded('https://www.nrk.no/skole/?mediaId=23618');
  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns url sent in if nrk api should return something else', async () => {
  nock('http://nrk-api')
    .get('/skole/api/media/23618')
    .reply(200, { somethingElse: 'test' });
  const url = await transformUrlIfNeeded('https://www.nrk.no/skole/?mediaId=23618');

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

test('transformUrlIfNeeded returns kahoot embed url if correct kahoot url is used', async () => {
  const url = await transformUrlIfNeeded(
    'https://create.kahoot.it/share/random/ab095e8e-1234-1234-1234-a0386f1811b5',
  );

  expect(url).toMatchSnapshot();
});

test('transformUrlIfNeeded returns original if wrong kahoot url is used', async () => {
  const url1 = await transformUrlIfNeeded(
    'https://create.kahoot.it/share/random/ab095e8e-1234-1234-1234-a0386f1811b5/test',
  );
  const url2 = await transformUrlIfNeeded(
    'https://create.kahoot.it/share/random/ab09e8e-1234-1234-1234-a0386f1811b',
  );

  expect(url1).toMatchSnapshot();
  expect(url2).toMatchSnapshot();
});

test('transformUrlIfNeeded returns original if kahoot profile url is used', async () => {
  const url1 = await transformUrlIfNeeded(
    'https://create.kahoot.it/profiles/random/ab095e8e-1234-1234-1234-a0386f1811b5',
  );

  expect(url1).toMatchSnapshot();
});

test('transformUrlIfNeeded returns codepen embed url', async () => {
  const url1 = await transformUrlIfNeeded('https://codepen.io/user/pen/qCnfB');
  expect(url1).toMatch('https://codepen.io/user/embed/qCnfB');

  const url2 = await transformUrlIfNeeded('https://codepen.io/team/user/pen/rzqYxX');
  expect(url2).toMatch('https://codepen.io/team/user/embed/rzqYxX');
});

test('transformUrlIfNeeded returns original if not pen', async () => {
  const url1 = await transformUrlIfNeeded('https://codepen.io/some-other-url');

  expect(url1).toMatch('https://codepen.io/some-other-url');
});

test('transformUrlIfNeeded replaces www with embed for ted.com', async () => {
  const url1 = await transformUrlIfNeeded('https://www.ted.com/talks/some_fancy_talk');
  expect(url1).toMatch('https://embed.ted.com/talks/some_fancy_talk');
});

test('transformUrlIfNeeded returns original for flourish', async () => {
  const url1 = await transformUrlIfNeeded(
    'https://public.flourish.studio/visualisation/8515737/embed',
  );
  expect(url1).toMatch('https://public.flourish.studio/visualisation/8515737/embed');
  const url2 = await transformUrlIfNeeded('https://flo.uri.sh/visualisation/8515737/embed');
  expect(url2).toMatch('https://flo.uri.sh/visualisation/8515737/embed');
});

test('transformUrlIfNeeded adds /embed for flourish', async () => {
  const url1 = await transformUrlIfNeeded('https://public.flourish.studio/visualisation/8515737/');
  expect(url1).toMatch('https://public.flourish.studio/visualisation/8515737/embed');
  const url2 = await transformUrlIfNeeded('https://flo.uri.sh/visualisation/8515737');
  expect(url2).toMatch('https://flo.uri.sh/visualisation/8515737/embed');
});

test('transformUrlIfNeeded creates embed-url for sketchup model if needed', async () => {
  const url1 = await transformUrlIfNeeded(
    'https://3dwarehouse.sketchup.com/model/eb498ef3-3de5-42ca-a621-34ea29cc08c4/Oppbygging-av-ringmur',
  );
  expect(url1).toMatch(
    'https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4',
  );
  const url2 = await transformUrlIfNeeded(
    'https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4',
  );
  expect(url2).toMatch(
    'https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4',
  );
});
