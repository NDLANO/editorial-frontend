/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

import Link from './Link';

export const TYPE = 'link';

export default function linkPlugin() {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    const { value } = editor.props;

    switch (node.type) {
      case TYPE:
        return <Link {...props} value={value} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
