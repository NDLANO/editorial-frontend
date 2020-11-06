/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Plugin, Value, DocumentJSON } from 'slate';
import { Editor } from 'slate-react';

import createSlateStore from './createSlateStore';
import { renderBlock } from './slateRendering';
import { Embed } from '../../interfaces';

interface Props {
  name: string;
  value: Embed;
  plugins: Plugin[];
  onChange: Function;
}

const slateStore = createSlateStore();

const VisualElementEditor = ({ name, value, plugins, onChange }: Props) => {
  const onChangeVisualElement = (change: { value: Value }) => {
    const node = change.value.toJSON()?.document?.nodes?.[0] as DocumentJSON;
    onChange({
      target: {
        name,
        value: node?.data || {},
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
