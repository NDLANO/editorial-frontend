/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor } from 'slate-react';

import createEmbedPlugin from './plugins/embed';
import visualElementPickerPlugin from './plugins/visualElementPicker';

const VisualElementEditor = ({
  value,
  onSelect,
  types,
  language
}) => {

  const plugins = [
    createEmbedPlugin(language),
    visualElementPickerPlugin({
      onSelect,
      types
    })
  ]

  return (
    <Editor
      value={value}
      plugins={plugins}
    />
  );
}

export default VisualElementEditor;