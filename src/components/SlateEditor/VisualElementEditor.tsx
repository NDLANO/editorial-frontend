/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Value } from 'slate';
import { Editor } from 'slate-react';

import createSlateStore from './createSlateStore';
import { renderBlock } from './slateRendering';

interface Props {
  name: string;
  value: any;
  plugins: any[];
  onChange: Function;
}

const slateStore = createSlateStore();

const VisualElementEditor = ({ name, value, plugins, onChange }: Props) => {
  const onChangeVisualElement = (change: any) => {
    onChange({
      target: {
        name,
        value: change.value.toJSON().document.nodes[0]?.data,
      },
    });
  };

  const editorValue = Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'embed',
          data: value,
          nodes: [
            {
              marks: [],
              object: 'text',
              text: '',
            },
          ],
        },
      ],
    },
  });

  return (
    <Editor
      name={name}
      value={editorValue}
      plugins={plugins}
      slateStore={slateStore}
      renderBlock={renderBlock}
      onChange={onChangeVisualElement}
    />
  );
};

export default VisualElementEditor;
