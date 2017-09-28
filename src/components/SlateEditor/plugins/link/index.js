/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditLink from './EditLink';
import SlateLink from './SlateLink';

export const TYPE = 'embed-inline';

export default function linkPlugin() {
  const schema = {
    nodes: {
      'embed-inline': SlateLink,
    },
  };

  return {
    schema,
    render: (props, state, editor) =>
      <span>
        <EditLink
          state={state}
          blur={editor.blur}
          slateStore={editor.props.slateStore}
          onChange={editor.onChange}
        />
        {props.children}
      </span>,
  };
}
