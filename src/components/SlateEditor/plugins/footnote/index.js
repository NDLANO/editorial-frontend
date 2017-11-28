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
    document: {
      nodes: [{ types: ['footnote'] }],
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node } = props;
    switch (node.type) {
      case 'footnote':
        return <Footnote {...props} />;
      default:
        return null;
    }
  };

  const renderEditor = (props, editor) => (
    <span>
      <EditFootnote
        value={editor.value}
        blur={editor.blur}
        slateStore={editor.props.slateStore}
        onChange={editor.onChange}
      />
      {props.children}
    </span>
  );

  return {
    schema,
    renderNode,
    renderEditor,
  };
}
