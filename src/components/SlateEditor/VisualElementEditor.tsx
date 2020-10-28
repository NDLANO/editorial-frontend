/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
    console.log(change.value)
    onChange(
      {
        target: {
          name,
          value: change.value,
          type: 'SlateEditorValue',
        },
      }
    );
  }

  return (
    <Editor
      name={name}
      value={value}
      plugins={plugins}
      slateStore={slateStore}
      renderBlock={renderBlock}
      onChange={onChangeVisualElement}
    />
  );
};

export default VisualElementEditor;
