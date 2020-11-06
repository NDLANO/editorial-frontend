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
    const { changeVisualElement, empty, language, types } = options;
    return empty ? (
      <VisualElementPicker
        editor={editor}
        language={language}
        onSelect={changeVisualElement}
        types={types}
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
