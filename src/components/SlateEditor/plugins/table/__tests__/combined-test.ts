/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSlate } from "@ndla/editor";
import { learningResourcePlugins } from "../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";

const editor = createSlate({ plugins: learningResourcePlugins });

describe("combined table plugin tests", () => {
  test("id in th and td is preserved on serialize and normalize", () => {
    const html =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th scope="row" id="r1" data-align="right"><p>1</p></th><td headers="01 r1" data-align="right"><p>2</p></td></tr></tbody></table></section>';
    const deserialized = blockContentToEditorValue(html);

    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(html);
  });

  test("Make sure cells in first row is marked as header", () => {
    const initial =
      '<section><table><thead><tr><th scope="col" data-align="right"><p>1</p></th><th scope="col" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th scope="row" data-align="right"><p>1</p></th><td data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th scope="row" id="r1" data-align="right"><p>1</p></th><td headers="01 r1" data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);

    editor.children = deserialized;
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });

  test("Make sure that headers and id is removed", () => {
    const initial =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><td headers="00" scope="row" id="r1" data-align="right"><p>1</p></td><td headers="01 r1" data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th scope="col" data-align="right"><p>1</p></th><th scope="col" data-align="right"><p>1</p></th></tr></thead><tbody><tr><td data-align="right"><p>1</p></td><td data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });

  test("Make sure th cells in thead and id and headers are set", () => {
    const initial =
      '<section><table><thead><tr><td scope="col" data-align="right"><p>1</p></td><td scope="col" data-align="right"><p>1</p></td></tr></thead><tbody><tr><th scope="row" data-align="right"><p>1</p></th><td data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th scope="row" id="r1" data-align="right"><p>1</p></th><td headers="01 r1" data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });

  test("make sure no id and headers when only rowHeaders", () => {
    const initial =
      '<section><table><tbody><tr><th scope="row" id="r1" data-align="right"><p>1</p></th><td headers="r1" data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const expected =
      '<section><table><tbody><tr><th scope="row" data-align="right"><p>1</p></th><td data-align="right"><p>2</p></td></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });

  test("make sure id and headers are set correctly when rowspan on header cell", () => {
    const initial =
      '<section><table><thead><tr><td scope="col" data-align="right"><p>1</p></td><td scope="col" data-align="right"><p>1</p></td></tr></thead><tbody><tr><th scope="row" rowSpan="2" data-align="right"><p>1</p></th><td data-align="right"><p>2</p></td></tr><tr><td><p>hallo</p></td></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th rowspan="2" scope="row" id="r1" data-align="right"><p>1</p></th><td headers="01 r1" data-align="right"><p>2</p></td></tr><tr><td headers="01 r1"><p>hallo</p></td></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });

  test("make sure headers and id are set correctly when rowspan on cell", () => {
    const initial =
      '<section><table><thead><tr><td scope="col" data-align="right"><p>1</p></td><td scope="col" data-align="right"><p>1</p></td></tr></thead><tbody><tr><th scope="row" data-align="right"><p>1</p></th><td rowspan="2" data-align="right"><p>2</p></td></tr><tr><th scope="row" data-align="right"><p>1</p></th></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th scope="col" id="00" data-align="right"><p>1</p></th><th scope="col" id="01" data-align="right"><p>1</p></th></tr></thead><tbody><tr><th scope="row" id="r1" data-align="right"><p>1</p></th><td rowspan="2" headers="01 r1 r2" data-align="right"><p>2</p></td></tr><tr><th scope="row" id="r2" data-align="right"><p>1</p></th></tr></tbody></table></section>';

    const deserialized = blockContentToEditorValue(initial);
    editor.reinitialize({ value: deserialized, shouldNormalize: true });

    const serialized = blockContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });
});
