/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditLink from './EditLink';
import Link from './Link';

export const TYPE = 'link';

export default function linkPlugin() {
  const schema = {
    document: {
      nodes: [{ types: 'link' }],
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node, editor, attributes, children } = props;
    const { value } = editor.props;

    switch (node.type) {
      case 'link':
        return <Link {...{ attributes, value, editor, node, children }} />;
      default:
        return null;
    }
  };

  const renderEditor = (props, editor) => (
    <span>
      <EditLink
        value={props.value}
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
