/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from "nock";
import { urlTransformers } from "../urlTransformers";

vi.mock("../../../../../config", () => {
  return {
    default: {
      norgesfilmNewUrl: true,
      runtimeType: "test",
    },
  };
});

const transformUrlIfNeeded = async (url: string) => {
  for (const rule of urlTransformers) {
    if (rule.shouldTransform(url, rule.domains)) {
      return await rule.transform(url);
    }
  }
  return url;
};

test("transformUrlIfNeeded returns static nrk url if correct nrk url is used", async () => {
  nock("http://nrk-api").get("/skole/api/media/23618").reply(200, { psId: "33" });
  const url = await transformUrlIfNeeded("https://www.nrk.no/skole-deling/23618");

  expect(url).toMatchSnapshot();
});

test("transformUrlIfNeeded returns url sent in if nrk api should return undefined", async () => {
  nock("http://nrk-api").get("/skole/api/media/23618").reply(200);
  const url = await transformUrlIfNeeded("https://www.nrk.no/skole-deling/23618");

  expect(url).toMatchSnapshot();
});

test("transformurlifNeeded returns static nrk url for old nrk embed format", async () => {
  nock("http://nrk-api").get("/skole/api/media/23618").reply(200, { psId: "33" });
  const url = await transformUrlIfNeeded("https://www.nrk.no/skole/?mediaId=23618");
  expect(url).toMatchSnapshot();
});

test("transformUrlIfNeeded returns url sent in if nrk api should return something else", async () => {
  nock("http://nrk-api").get("/skole/api/media/23618").reply(200, { somethingElse: "test" });
  const url = await transformUrlIfNeeded("https://www.nrk.no/skole/?mediaId=23618");

  expect(url).toMatchSnapshot();
});

test("transformUrlIfNeeded returns same url if not from nrk", async () => {
  const url = await transformUrlIfNeeded("https://somerandomurl.com");

  expect(url).toMatchSnapshot();
});

test("transformUrlIfNeeded returns codepen embed url", async () => {
  const url1 = await transformUrlIfNeeded("https://codepen.io/user/pen/qCnfB");
  expect(url1).toMatch("https://codepen.io/user/embed/qCnfB");

  const url2 = await transformUrlIfNeeded("https://codepen.io/team/user/pen/rzqYxX");
  expect(url2).toMatch("https://codepen.io/team/user/embed/rzqYxX");
});

test("transformUrlIfNeeded returns original if not pen", async () => {
  const url1 = await transformUrlIfNeeded("https://codepen.io/some-other-url");

  expect(url1).toMatch("https://codepen.io/some-other-url");
});

test("transformUrlIfNeeded replaces www with embed for ted.com", async () => {
  const url1 = await transformUrlIfNeeded("https://www.ted.com/talks/some_fancy_talk");
  expect(url1).toMatch("https://embed.ted.com/talks/some_fancy_talk");
});

test("transformUrlIfNeeded returns original for flourish", async () => {
  const url1 = await transformUrlIfNeeded("https://public.flourish.studio/visualisation/8515737/embed");
  expect(url1).toMatch("https://public.flourish.studio/visualisation/8515737/embed");
  const url2 = await transformUrlIfNeeded("https://flo.uri.sh/visualisation/8515737/embed");
  expect(url2).toMatch("https://flo.uri.sh/visualisation/8515737/embed");
});

test("transformUrlIfNeeded adds /embed for flourish", async () => {
  const url1 = await transformUrlIfNeeded("https://public.flourish.studio/visualisation/8515737");
  expect(url1).toMatch("https://public.flourish.studio/visualisation/8515737/embed");
  const url2 = await transformUrlIfNeeded("https://flo.uri.sh/visualisation/8515737");
  expect(url2).toMatch("https://flo.uri.sh/visualisation/8515737/embed");
});

test("transformUrlIfNeeded creates embed-url for sketchup model if needed", async () => {
  const url1 = await transformUrlIfNeeded(
    "https://3dwarehouse.sketchup.com/model/eb498ef3-3de5-42ca-a621-34ea29cc08c4/Oppbygging-av-ringmur",
  );
  expect(url1).toMatch("https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4");
  const url2 = await transformUrlIfNeeded(
    "https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4",
  );
  expect(url2).toMatch("https://3dwarehouse.sketchup.com/embed/eb498ef3-3de5-42ca-a621-34ea29cc08c4");
});

test("transformUrlIfNeeded transforms url for sketchfab", async () => {
  const url1 = await transformUrlIfNeeded(
    "https://sketchfab.com/3d-models/bombardier-learjet-60-7573f836dd3a46bdbce8b90b5a40f104",
  );
  expect(url1).toMatch("https://sketchfab.com/models/7573f836dd3a46bdbce8b90b5a40f104/embed");
});

test("transformUrlIfNeeded adds ?embeddable=true for gapminder", async () => {
  const url1 = await transformUrlIfNeeded(
    "https://www.gapminder.org/tools/#$model$markers$line$data$filter$dimensions$geo",
  ); // abbreviated
  expect(url1).toMatch("https://www.gapminder.org/tools/?embedded=true#$model$markers$line$data$filter$dimensions$geo");
});

test("transformUrlIfNeeded strips ndlafilm for filmiundervisning.no", async () => {
  const url1 = await transformUrlIfNeeded("https://ndla.filmiundervisning.no/film/ndlafilm.aspx?filmId=400199");
  expect(url1).toMatch("https://ndla.filmiundervisning.no/film/400199");
});

test("transformUrlIfNeeded adds embed.html for kartiskolen", async () => {
  const url1 = await transformUrlIfNeeded(
    "https://kartiskolen.no/?topic=generelt&lang=nb&bgLayer=vanlig_grunnkart&layers=hoydekurver",
  );
  expect(url1).toMatch(
    "https://kartiskolen.no/embed.html?topic=generelt&lang=nb&bgLayer=vanlig_grunnkart&layers=hoydekurver",
  );
});

test("transformUrlIfNeeded returns input for invalid urls", async () => {
  const url1 = await transformUrlIfNeeded("certanlynotanurl");
  expect(url1).toMatch("certanlynotanurl");
});
