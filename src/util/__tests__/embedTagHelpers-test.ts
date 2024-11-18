/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { blockContentToEditorValue } from "../articleContentConverter";
import {
  parseEmbedTag,
  createEmbedTag,
  isUserProvidedEmbedDataValid,
  createEmbedTagV2,
  reduceElementDataAttributesV2,
} from "../embedTagHelpers";

test("parseEmbedTag parses image embed tag to object", () => {
  const obj = parseEmbedTag(
    `<ndlaembed
      data-size="full"
      data-align=""
      data-resource="image"
      data-alt="Guinness sign"
      data-caption="Guinness is good for you" data-resource_id="42159"
      data-resource_id="0"
      data-url="https://api.ndla.no/image-api/v3/images/42159"></ndlaembed>`,
  );
  expect(obj).toMatchSnapshot();
});

test("parseEmbedTag parses brightcove embed tag to object", () => {
  const obj = parseEmbedTag(
    `<ndlaembed
      data-account="4806596774001"
      data-caption="Intervju med Hallvard"
      data-player="BkLm8fT"
      data-resource="brightcove"
      data-videoid="ref:106952"
      data-id="0"></ndlaembed>`,
  );
  expect(obj).toMatchSnapshot();
});

test("parseEmbedTag parses h5p embed tag to object", () => {
  const obj = parseEmbedTag(
    `<ndlaembed
      data-resource="h5p"
      data-url="https://h5p-test.ndla.no/resource/3ab6850d-cd30-4f11-aead-8be65f66f566/oembed"
      data-id="0"></ndlaembed>`,
  );
  expect(obj).toMatchSnapshot();
});

test("parseEmbedTag parses related-content embed tag to object", () => {
  const obj = parseEmbedTag(
    `<ndlaembed
      data-article-id="363"
      data-resource="related-content"
     ></ndlaembed>`,
  );
  expect(obj).toMatchSnapshot();
});

test("createEmbedTag creates image embed tag from object", () => {
  const tag = createEmbedTag(
    {
      align: "",
      alt: "Guinness sign",
      caption: "Guinness is good for you",
      metaData: {},
      resource: "image",
      resource_id: "42159",
      size: "full",
      url: "https://api.ndla.no/image-api/v3/images/42159",
    },
    undefined,
  );
  expect(tag).toMatchSnapshot();
});

test("createEmbedTagV2 creates image embed tag from object", () => {
  const data = {
    align: "",
    alt: "Guinness sign",
    caption: "Guinness is good for you",
    resource: "image",
    resource_id: "42159",
    size: "full",
    url: "https://api.ndla.no/image-api/v3/images/42159",
  };
  expect(createEmbedTag(data, undefined)).toEqual(createEmbedTagV2(data, undefined, undefined));
});

test("createEmbedTag creates h5p embed tag from object", () => {
  const tag = createEmbedTag(
    {
      metaData: {},
      resource: "h5p",
      url: "https://h5p-test.ndla.no/resource/3ab6850d/oembed",
    },
    undefined,
  );

  expect(tag).toMatchSnapshot();
});

test("createEmbedTagV2 creates h5p embed tag from object", () => {
  const data = {
    resource: "h5p",
    url: "https://h5p-test.ndla.no/resource/3ab6850d/oembed",
  };

  const tag = createEmbedTagV2(data, undefined, undefined);
  expect(tag).toMatchSnapshot();
});

test("createEmbedTagV2 filters out null and undefined values, but not false values", () => {
  const data = {
    resource: "unknown",
    caption: undefined,
    player: undefined,
    autoPlay: "false",
    videoid: "123",
  };

  const tag = createEmbedTagV2(data, undefined, undefined);

  expect(tag).toMatchSnapshot();
});

test("createEmbedTag creates brightcove embed tag from object", () => {
  const tag = createEmbedTag(
    {
      account: "4806596774001",
      caption: "Intervju med Hallvard",
      metaData: {},
      player: "BkLm8fT",
      resource: "brightcove",
      videoid: "ref:106952",
    },
    undefined,
  );

  expect(tag).toMatchSnapshot();
});

test("createEmbedTagV2 converts camel-case to kebab-case", () => {
  const data = {
    resource: "audio",
    resourceId: "123",
    type: "standard",
    url: "https://api.test.ndla.no/audio-api/v1/audio/3000",
  };

  const tag = createEmbedTagV2(data, undefined, undefined);
  expect(tag).toMatchSnapshot();
});

test("createEmbedTagV2 creates brightcove embed tag from object", () => {
  const data = {
    account: "4806596774001",
    caption: "Intervju med Hallvard",
    player: "BkLm8fT",
    resource: "brightcove",
    videoid: "ref:106952",
  };
  const tag = createEmbedTagV2(data, undefined, undefined);

  expect(tag).toEqual(createEmbedTag(data, undefined));
});

test("createEmbedTag returns undefined if the object contains no keys", () => {
  expect(createEmbedTag({}, undefined)).toBe(undefined);
});

test("createEmbedTagV2 returns undefined if the object contains no keys", () => {
  expect(createEmbedTagV2({}, undefined, undefined)).toBe(undefined);
});

test("isUserProvidedEmbedDataValid for image", () => {
  expect(
    isUserProvidedEmbedDataValid({
      resource: "image",
      resourceId: "123",
      alt: "Alternative",
      caption: "Intervju med Hallvard",
    }),
  ).toBe(true);

  expect(
    isUserProvidedEmbedDataValid({
      resource: "image",
      resourceId: "123",
      alt: "",
      caption: "Intervju med Hallvard",
    }),
  ).toBe(false);

  expect(
    isUserProvidedEmbedDataValid({
      resource: "image",
      resourceId: "123",
      alt: "Alt",
    }),
  ).toBe(true);
});

test("deserializing related-content works", () => {
  const deserialized = blockContentToEditorValue(
    '<div data-type="related-content"><ndlaembed data-url="http://www.vg.no" data-resource="related-content" data-title="Forsiden vg"></ndlaembed><ndlaembed data-resource="related-content" data-article-id="54"></ndlaembed></div>',
  );

  expect(deserialized).toMatchSnapshot();
});

test("reduceElementDataAttributesV2 removes styled attribute", () => {
  const attributes = [{ name: "style", value: "{display: flex;}" }];
  const res = reduceElementDataAttributesV2(attributes);
  expect(Object.keys(res).length).toBe(0);
});

test("reduceElementDataAttributesV2 correctly parses data attributes", () => {
  const attributes = [
    { name: "style", value: "{display: flex;}" },
    { name: "data-align", value: "center" },
    { name: "data-image-id", value: "123" },
  ];
  const expected = { imageId: "123", align: "center" };
  const res = reduceElementDataAttributesV2(attributes);
  expect(res).toEqual(expected);
});

test("reduceElementDataAttributesV2 leaves weird parameters alone", () => {
  const attributes = [
    { name: "style", value: "{display: flex;}" },
    { name: "aria-label", value: "Test" },
    { name: "data-imageid", value: "1234" },
    { name: "data-resource_id", value: "123" },
  ];
  const expected = { imageid: "1234", resourceId: "123", "aria-label": "Test" };
  const res = reduceElementDataAttributesV2(attributes);
  expect(res).toEqual(expected);
});

test("reduceElementDataAttributesV2 only returns filter values", () => {
  const attributes = [
    { name: "style", value: "{display: flex;}" },
    { name: "src", value: "https://ndla.no" },
    { name: "data-image-id", value: "123" },
  ];
  const expected = { src: "https://ndla.no", imageId: "123" };
  const res = reduceElementDataAttributesV2(attributes, ["src", "data-image-id"]);
  expect(res).toEqual(expected);
});
