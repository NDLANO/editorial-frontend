/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { isValidURL } from '../htmlHelpers';

test('util/htmlHelpers isValidUrl', () => {
  expect(
    isValidURL('http://en.wikipedia.org/wiki/Procter_&_Gamble'),
  ).toBeTruthy();
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
  expect(
    isValidURL('https://www.youtube.com/embed/VWuQ1y6IDng?feature=oembed'),
  ).toBeTruthy();
  expect(
    isValidURL('https://player.vimeo.com/video/178939743?app_id=122963'),
  ).toBeTruthy();
  expect(
    isValidURL(
      'https://www.slideshare.net/slideshow/embed_code/key/LxxywSCOgTBFi1',
    ),
  ).toBeTruthy();
  expect(
    isValidURL('https://nb.khanacademy.org/embed_video?v=jHPr-CuvHhs'),
  ).toBeTruthy();
  expect(
    isValidURL('https://embed.kahoot.it/cde77f0f-e3ed-477c-8b7e-5b8ff9a05ae6'),
  ).toBeTruthy();
  expect(
    isValidURL('https://www.tv2skole.no/e/fullvideo/1041959?start=0'),
  ).toBeTruthy();
  expect(isValidURL('https://w')).toBeFalsy();
  expect(isValidURL('https://sdfasdp.ppppppppppp')).toBeFalsy();
});
