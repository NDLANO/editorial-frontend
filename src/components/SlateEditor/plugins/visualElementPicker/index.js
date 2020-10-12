/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import VisualElementPicker from './VisualElementPicker';

export default function visualElementPickerPlugin(options = {}) {
  const schema = {};
  const renderEditor = (props, editor, next) => {
    const children = next();
    const { types, language, empty, onSelect } = options;
    return empty ? (
      <VisualElementPicker
        onSelect={onSelect}
        types={types}
        editor={editor}
        visualElement={options.embed}
        language={language}
      />
    ) : (
      children
    );
  };

  return {
    schema,
    renderEditor,
  };
}
