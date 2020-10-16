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
import { renderBlock } from './slateRendering'

interface Props {
  value: any,
  plugins: any[],
}

const slateStore = createSlateStore();

const VisualElementEditor = ({
  value,
  plugins,
}: Props) => {

  return (
    <Editor
      value={value}
      plugins={plugins}
      slateStore={slateStore}
      renderBlock={renderBlock}
    />
  );
};

export default VisualElementEditor;
