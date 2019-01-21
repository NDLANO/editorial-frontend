/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import SlateBlockPicker from './SlateBlockPicker';
import options from './options';

export default function blockPickerPlugin(addSection, opts = {}) {
  const schema = {};
  const renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <React.Fragment>
        <SlateBlockPicker
          editor={editor}
          onChange={editor.onChange}
          addSection={addSection}
          {...options(opts)}
        />
        {children}
      </React.Fragment>
    );
  };

  return {
    schema,
    renderEditor,
  };
}
