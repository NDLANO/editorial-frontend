/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditFootnote from './EditFootnote';
import Footnote from './Footnote';

export const TYPE = 'footnote';

export default function footnotePlugin() {
  const schema = {
    nodes: {
      footnote: Footnote,
    },
  };
  return {
    schema,
    render: (props, state, editor) => (
      <span>
        <EditFootnote
          state={state}
          blur={editor.blur}
          slateStore={editor.props.slateStore}
          onChange={editor.onChange}
        />
        {props.children}
      </span>
    ),
  };
}
