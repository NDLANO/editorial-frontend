/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { isValidURL, isNDLAFrontendUrl, urlDomain, urlOrigin } from '../htmlHelpers';

test('util/htmlHelpers isValidUrl', () => {
  expect(isValidURL('http://en.wikipedia.org/wiki/Procter_&_Gamble')).toBeTruthy();
  expect(
    isValidURL(
      'http://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&docid=nIv5rk2GyP3hXM&tbnid=isiOkMe3nCtexM:&ved=0CAUQjRw&url=http%3A%2F%2Fanimalcrossing.wikia.com%2Fwiki%2FLion&ei=ygZXU_2fGKbMsQTf4YLgAQ&bvm=bv.65177938,d.aWc&psig=AFQjCNEpBfKnal9kU7Zu4n7RnEt2nerN4g&ust=1398298682009707',
    ),
  ).toBeTruthy();
  expect(isValidURL('https://ddddddd')).toBeFalsy();
  expect(isValidURL('dddddddddddddd')).toBeFalsy();
  expect(isValidURL('magnet:?xt=urn:btih:123')).toBeFalsy();
  expect(isValidURL('https://stackoverflow.com/')).toBeTruthy();
  expect(isValidURL('https://ndla.no/')).toBeTruthy();
  expect(isValidURL('https://www.youtube.com/embed/VWuQ1y6IDng?feature=oembed')).toBeTruthy();
  expect(isValidURL('https://player.vimeo.com/video/178939743?app_id=122963')).toBeTruthy();
  expect(
    isValidURL('https://www.slideshare.net/slideshow/embed_code/key/LxxywSCOgTBFi1'),
  ).toBeTruthy();
  expect(isValidURL('https://nb.khanacademy.org/embed_video?v=jHPr-CuvHhs')).toBeTruthy();
  expect(isValidURL('https://embed.kahoot.it/cde77f0f-e3ed-477c-8b7e-5b8ff9a05ae6')).toBeTruthy();
  expect(isValidURL('https://www.tv2skole.no/e/fullvideo/1041959?start=0')).toBeTruthy();
  expect(isValidURL('https://w')).toBeFalsy();
  expect(isValidURL('https://sdfasdp.ppppppppppp')).toBeFalsy();
});

test('util/isNDLAFrontendUrl', () => {
  expect(isNDLAFrontendUrl('')).toBeFalsy();
  expect(isNDLAFrontendUrl('http://knowit.no')).toBeFalsy();
  expect(isNDLAFrontendUrl('http://vg.no/article/123')).toBeFalsy();
  expect(isNDLAFrontendUrl('https://www.test.ndla.no/article/123')).toBeTruthy();
  expect(isNDLAFrontendUrl('https://www.test.ndla.no/nb/article/123')).toBeTruthy();
  expect(
    isNDLAFrontendUrl(
      'https://test.ndla.no/subjects/subject:6/topic:1:182849/topic:1:175043/resource:1:175253?filters=urn:filter:01c27030-e8f8-4a7c-a5b3-489fdb8fea30',
    ),
  ).toBeTruthy();
  expect(isNDLAFrontendUrl('https://test.ndla.no/nb/subject:6/topic:1:182849')).toBeTruthy();
  expect(isNDLAFrontendUrl('https://test.ndla.no/subject:6/topic:1:182849')).toBeTruthy();
  expect(isNDLAFrontendUrl('https://test.ndla.no/node/182849')).toBeTruthy();
});

test('urlDomain gets correct domain from url', () => {
  expect(urlDomain('https://ndla.no')).toBe('ndla.no');
});

test('urlOrigin gets correct origin from url', () => {
  expect(
    urlOrigin(
      'https://test.ndla.no/subjects/subject:6/topic:1:182849/topic:1:175043/resource:1:175253',
    ),
  ).toBe('https://test.ndla.no');
});
