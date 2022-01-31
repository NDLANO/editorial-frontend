/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import withPlugins from '../../../utils/withPlugins';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';

import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../../../../util/articleContentConverter';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('combined table plugin tests', () => {
  test('id in th and td is preserved on serialize and normalize', () => {
    const html =
      '<section><table><tbody><tr><th id="123" scope="row"><p>1</p></th><td id="abc"><p>2</p></td></tr></tbody></table></section>';

    const deserialized = learningResourceContentToEditorValue(html);

    editor.children = deserialized;
    Editor.normalize(editor, { force: true });

    const serialized = learningResourceContentToHTML(editor.children);
    expect(serialized).toMatch(html);
  });

  test('Make sure cells in first row is marked as header', () => {
    const initial =
      '<section><table><thead><tr><td>1</td></tr></thead><tbody><tr><td>2</td></tr></tbody></table></section>';

    const expected =
      '<section><table><thead><tr><th>1</th></tr></thead><tbody><tr><td>2</td></tr></tbody></table></section>';

    const deserialized = learningResourceContentToEditorValue(initial);

    editor.children = deserialized;
    Editor.normalize(editor, { force: true });

    const serialized = learningResourceContentToHTML(editor.children);
    expect(serialized).toMatch(expected);
  });
});
