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

export default function linkPlugin(language) {
  const schema = {
    document: {},
    inlines: {
      link: {
        data: {},
        nodes: [
          {
            match: { object: 'text' },
          },
        ],
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderInline = (props, editor, next) => {
    const { node } = props;

    switch (node.type) {
      case TYPE:
        return <Link {...props} editor={editor} language={language} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderInline,
  };
}
