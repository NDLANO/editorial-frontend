/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { plugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/LearningResourceContent';
import withPlugins from '../../../utils/withPlugins';
import { definitionList } from '../utils/defaultBlocks';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('definition normalizing tests', () => {
  test('expect list with 1 definition pair not to change', () => {
    const editorValue: Descendant[] = [definitionList];
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });

    expect(editor.children).toEqual(editorValue);
  });
});
