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
  return {
    schema: {},
    render: (props, state, editor) => (
      <span>
        <SlateBlockPicker
          editorState={state}
          onChange={editor.onChange}
          addSection={addSection}
          {...options(opts)}
        />
        {props.children}
      </span>
    ),
  };
}
