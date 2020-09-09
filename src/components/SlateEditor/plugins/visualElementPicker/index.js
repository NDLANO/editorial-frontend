/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import VisualELementMenu from '../../../../containers/VisualElement/VisualElementMenu';

export default function visualElementPickerPlugin(options = {}) {
  const schema = {};
  const renderEditor = (props, editor, next) => {

    console.log(options)
    return (
      <VisualELementMenu
        onSelect={options.onSelect}
        types={options.types}
        editor={editor}
        visualElement={options.embed}
      />
    );
  };

  return {
    schema,
    renderEditor,
  };
}