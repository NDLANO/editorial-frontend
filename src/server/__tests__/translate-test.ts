/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { wrapDocument, unwrapDocument } from "../translate";

const htmlify = (text: string) => `<html><head></head><body>${text}</body></html>`;

test("wrapDocument wraps span with lang in ndlaskip", () => {
  expect(wrapDocument("Hei")).toBe(htmlify("Hei"));
  expect(wrapDocument("Dette er en <span lang='no'>språkmerka tekst</span>")).toBe(
    htmlify('Dette er en <ndlaskip><span lang="no">språkmerka tekst</span></ndlaskip>'),
  );
  expect(wrapDocument("<ndlaembed data-attr='no'></ndlaembed>")).toBe(
    htmlify('<ndlaembed data-attr="<ndlaskip>no</ndlaskip>"></ndlaembed>'),
  );
  expect(wrapDocument("<ndlaembed data-title='Her er en tittel som skal oversettes'></ndlaembed>")).toBe(
    htmlify('<ndlaembed data-title="Her er en tittel som skal oversettes"></ndlaembed>'),
  );
  expect(
    wrapDocument(
      "<ndlaembed data-title='Her er en tittel som skal oversettes' data-alt='Og en alt som ikke skal oversettes'></ndlaembed>",
    ),
  ).toBe(
    htmlify(
      '<ndlaembed data-title="Her er en tittel som skal oversettes" data-alt="<ndlaskip>Og en alt som ikke skal oversettes</ndlaskip>"></ndlaembed>',
    ),
  );

  const document =
    '<section><ndlaembed data-resource="image" data-resource_id="3003" data-alt="Jente sitter i bagasjerommet sammen med vesker og kofferter. Foto." data-caption="Jente <span lang=&quot;no&quot;>sitter</span> i bagasjerommet sammen med vesker og kofferter. Foto." data-is-decorative="false" data-border="false" data-align="" data-size="full" data-hide-byline="true" data-url="https://api.test.ndla.no/image-api/v2/images/3003"></ndlaembed><h2><span lang="zh">准备</span> Zhǔnbèi</h2><h3>Dette bør du kjenne til på forhånd:</h3><ul><li>hvordan du kommer med forslag til aktiviteter</li><li>hvordan du uttrykker at du liker eller ikke liker noe</li><li>hvordan du uttrykker at det har oppstått en ny situasjon</li><li>Kinas geografi</li><li>klima og årstider i Kina</li></ul></section><section><div data-type="related-content"><ndlaembed data-article-id="3648" data-resource="related-content"></ndlaembed></div></section>';
  const expected =
    '<section><ndlaembed data-resource="<ndlaskip>image</ndlaskip>" data-resource_id="<ndlaskip>3003</ndlaskip>" data-alt="<ndlaskip>Jente sitter i bagasjerommet sammen med vesker og kofferter. Foto.</ndlaskip>" data-caption="Jente <ndlaskip><span lang=&quot;no&quot;>sitter</span></ndlaskip> i bagasjerommet sammen med vesker og kofferter. Foto." data-is-decorative="<ndlaskip>false</ndlaskip>" data-border="<ndlaskip>false</ndlaskip>" data-align data-size="<ndlaskip>full</ndlaskip>" data-hide-byline="<ndlaskip>true</ndlaskip>" data-url="<ndlaskip>https://api.test.ndla.no/image-api/v2/images/3003</ndlaskip>"></ndlaembed><h2><ndlaskip><span lang="zh">准备</span></ndlaskip> Zhǔnbèi</h2><h3>Dette bør du kjenne til på forhånd:</h3><ul><li>hvordan du kommer med forslag til aktiviteter</li><li>hvordan du uttrykker at du liker eller ikke liker noe</li><li>hvordan du uttrykker at det har oppstått en ny situasjon</li><li>Kinas geografi</li><li>klima og årstider i Kina</li></ul></section><section><div data-type="related-content"><ndlaembed data-article-id="<ndlaskip>3648</ndlaskip>" data-resource="<ndlaskip>related-content</ndlaskip>"></ndlaembed></div></section>';
  expect(wrapDocument(document)).toBe(htmlify(expected));
});

test("unwrapDocument does the exact opposite as the other test", () => {
  expect(unwrapDocument(htmlify("Hei"))).toBe("Hei");
  expect(unwrapDocument(htmlify('Dette er en <ndlaskip><span lang="no">språkmerka tekst</span></ndlaskip>'))).toBe(
    'Dette er en <span lang="no">språkmerka tekst</span>',
  );
  expect(unwrapDocument(htmlify('<ndlaembed data-attr="<ndlaskip>no</ndlaskip>"></ndlaembed>'))).toBe(
    '<ndlaembed data-attr="no"></ndlaembed>',
  );
  expect(unwrapDocument(htmlify('<ndlaembed data-title="Her er en tittel som skal oversettes"></ndlaembed>'))).toBe(
    '<ndlaembed data-title="Her er en tittel som skal oversettes"></ndlaembed>',
  );
  expect(
    unwrapDocument(
      htmlify(
        '<ndlaembed data-title="Her er en tittel som skal oversettes" data-alt="<ndlaskip>Og en alt som ikke skal oversettes</ndlaskip>"></ndlaembed>',
      ),
    ),
  ).toBe(
    '<ndlaembed data-title="Her er en tittel som skal oversettes" data-alt="Og en alt som ikke skal oversettes"></ndlaembed>',
  );

  const wrappedDocument =
    '<section><ndlaembed data-resource="<ndlaskip>image</ndlaskip>" data-resource_id="<ndlaskip>3003</ndlaskip>" data-alt="<ndlaskip>Jente sitter i bagasjerommet sammen med vesker og kofferter. Foto.</ndlaskip>" data-caption="Jente <ndlaskip><span lang=&quot;no&quot;>sitter</span></ndlaskip> i bagasjerommet sammen med vesker og kofferter. Foto." data-is-decorative="<ndlaskip>false</ndlaskip>" data-border="<ndlaskip>false</ndlaskip>" data-align data-size="<ndlaskip>full</ndlaskip>" data-hide-byline="<ndlaskip>true</ndlaskip>" data-url="<ndlaskip>https://api.test.ndla.no/image-api/v2/images/3003</ndlaskip>"></ndlaembed><h2><ndlaskip><span lang="zh">准备</span></ndlaskip> Zhǔnbèi</h2><h3>Dette bør du kjenne til på forhånd:</h3><ul><li>hvordan du kommer med forslag til aktiviteter</li><li>hvordan du uttrykker at du liker eller ikke liker noe</li><li>hvordan du uttrykker at det har oppstått en ny situasjon</li><li>Kinas geografi</li><li>klima og årstider i Kina</li></ul></section><section><div data-type="related-content"><ndlaembed data-article-id="<ndlaskip>3648</ndlaskip>" data-resource="<ndlaskip>related-content</ndlaskip>"></ndlaembed></div></section>';
  const expectedUnwrappedDocument =
    '<section><ndlaembed data-resource="image" data-resource_id="3003" data-alt="Jente sitter i bagasjerommet sammen med vesker og kofferter. Foto." data-caption="Jente <span lang=&quot;no&quot;>sitter</span> i bagasjerommet sammen med vesker og kofferter. Foto." data-is-decorative="false" data-border="false" data-align="" data-size="full" data-hide-byline="true" data-url="https://api.test.ndla.no/image-api/v2/images/3003"></ndlaembed><h2><span lang="zh">准备</span> Zhǔnbèi</h2><h3>Dette bør du kjenne til på forhånd:</h3><ul><li>hvordan du kommer med forslag til aktiviteter</li><li>hvordan du uttrykker at du liker eller ikke liker noe</li><li>hvordan du uttrykker at det har oppstått en ny situasjon</li><li>Kinas geografi</li><li>klima og årstider i Kina</li></ul></section><section><div data-type="related-content"><ndlaembed data-article-id="3648" data-resource="related-content"></ndlaembed></div></section>';
  expect(unwrapDocument(htmlify(wrappedDocument))).toBe(expectedUnwrappedDocument);
});
