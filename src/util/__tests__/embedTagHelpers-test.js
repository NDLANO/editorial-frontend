/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import jsdom from 'jsdom';
import Html from 'slate-html-serializer';
import {
  parseEmbedTag,
  createEmbedTag,
  isUserProvidedEmbedDataValid,
} from '../embedTagHelpers';
import { divRule, toJSON } from '../slateHelpers';

const { fragment } = jsdom.JSDOM;

test('parseEmbedTag parses image embed tag to object', () => {
  const obj = parseEmbedTag(
    `<embed
      data-size="fullbredde"
      data-align=""
      data-resource="image"
      data-alt="Guinness sign"
      data-caption="Guinness is good for you" data-resource_id="42159"
      data-id="0"
      data-url="https://api.ndla.no/image-api/v2/images/42159">`,
  );
  expect(obj).toMatchSnapshot();
});

test('parseEmbedTag parses brightcove embed tag to object', () => {
  const obj = parseEmbedTag(
    `<embed
      data-account="4806596774001"
      data-caption="Intervju med Hallvard"
      data-player="BkLm8fT"
      data-resource="brightcove"
      data-videoid="ref:106952"
      data-id="0">`,
  );
  expect(obj).toMatchSnapshot();
});

test('parseEmbedTag parses h5p embed tag to object', () => {
  const obj = parseEmbedTag(
    `<embed
      data-resource="h5p"
      data-url="https://h5p-test.ndla.no/resource/3ab6850d-cd30-4f11-aead-8be65f66f566/oembed"
      data-id="0">`,
  );
  expect(obj).toMatchSnapshot();
});

test('createEmbedTag creates image embed tag from object', () => {
  const tag = createEmbedTag({
    align: '',
    alt: 'Guinness sign',
    caption: 'Guinness is good for you',
    metaData: {},
    resource: 'image',
    resource_id: '42159',
    size: 'fullbredde',
    url: 'https://api.ndla.no/image-api/v2/images/42159',
  });
  expect(tag).toMatchSnapshot();
});

test('createEmbedTag creates h5p embed tag from object', () => {
  const tag = createEmbedTag({
    metaData: {},
    resource: 'h5p',
    url: 'https://h5p-test.ndla.no/resource/3ab6850d/oembed',
  });

  expect(tag).toMatchSnapshot();
});

test('createEmbedTag creates brightcove embed tag from object', () => {
  const tag = createEmbedTag({
    account: '4806596774001',
    caption: 'Intervju med Hallvard',
    metaData: {},
    player: 'BkLm8fT',
    resource: 'brightcove',
    videoid: 'ref:106952',
  });

  expect(tag).toMatchSnapshot();
});

test('createEmbedTag returns undefined if the object contains no keys', () => {
  expect(createEmbedTag({})).toBe(undefined);
});

test('isUserProvidedEmbedDataValid for image', () => {
  expect(
    isUserProvidedEmbedDataValid({
      resource: 'image',
      alt: 'Alternative',
      caption: 'Intervju med Hallvard',
    }),
  ).toBe(true);

  expect(
    isUserProvidedEmbedDataValid({
      resource: 'image',
      alt: '',
      caption: 'Intervju med Hallvard',
    }),
  ).toBe(false);

  expect(
    isUserProvidedEmbedDataValid({
      resource: 'image',
      alt: 'Alt',
    }),
  ).toBe(true);
});

test('isUserProvidedEmbedDataValid for brightcove', () => {
  expect(
    isUserProvidedEmbedDataValid({
      resource: 'brightcove',
      caption: 'Intervju med Hallvard',
    }),
  ).toBe(true);

  expect(
    isUserProvidedEmbedDataValid({
      resource: 'brightcove',
      caption: '',
    }),
  ).toBe(false);
});

test('isUserProvidedEmbedDataValid for audio', () => {
  expect(
    isUserProvidedEmbedDataValid({
      resource: 'audio',
    }),
  ).toBe(true);
});

test('deserializing related-content works', () => {
  const serializer = new Html({ rules: [divRule], parseHtml: fragment });
  const deserialized = serializer.deserialize(
    '<div data-resource="related-content"><embed data-url="www.vg.no" data-title="Forsiden vg" /><embed data-articleId=54 /></div>',
  );

  expect(toJSON(deserialized)).toMatchSnapshot();
});
