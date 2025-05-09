/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { blockContentToEditorValue } from "../articleContentConverter";
import { parseEmbedTag, isUserProvidedEmbedDataValid } from "../embedTagHelpers";

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
