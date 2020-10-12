/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { Editor } from 'slate-react';

import createSlateStore from './createSlateStore';
import visualElementPlugin from './plugins/visualElement';
import visualElementPickerPlugin from './plugins/visualElementPicker';

const slateStore = createSlateStore();

const VisualElementEditor = ({
  value,
  plugins,
  renderBlock,
  changeVisualElement,
}) => {
  return (
    <Editor
      value={value}
      plugins={plugins}
      slateStore={slateStore}
      renderBlock={renderBlock}
      onChange={changeVisualElement}
    />
  );
};

export default VisualElementEditor;
