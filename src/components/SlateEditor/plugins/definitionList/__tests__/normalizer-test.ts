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
import { definitionList } from '../utils';

const editor = withHistory(
  withReact(withPlugins(createEditor(), plugins('nb', 'nb', { current: () => {} }))),
);

describe('definition normalizing tests', () => {
  test('normalize normal', () => {
    const editorValue: Descendant[] = [definitionList];
    const normalizedValue = editorValue;
    editor.children = editorValue;
    Editor.normalize(editor, { force: true });

    expect(editor.children).toEqual(normalizedValue);
  });
});
