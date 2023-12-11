/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEditor, Descendant, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { learningResourcePlugins } from '../../../../../containers/ArticlePage/LearningResourcePage/components/learningResourcePlugins';
import withPlugins from '../../../utils/withPlugins';
import { TYPE_SECTION } from '../../section/types';
import { TYPE_PARAGRAPH } from '../types';

const editor = withHistory(withReact(withPlugins(createEditor(), learningResourcePlugins)));

describe('paragraph normalizer tests', () => {
  test('Remove serializeAsText from paragraph that is not placed in list-item', () => {
    const editorValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            serializeAsText: true,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    const expectedValue: Descendant[] = [
      {
        type: TYPE_SECTION,
        children: [
          {
            type: TYPE_PARAGRAPH,
            children: [{ text: '' }],
          },
        ],
      },
    ];

    editor.children = editorValue;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual(expectedValue);
  });
});
