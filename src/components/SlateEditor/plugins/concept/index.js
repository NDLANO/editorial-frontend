/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditSlateConcept from './EditSlateConcept';

export const TYPE = 'concept';

export default function conceptPlugin(locale) {
  const schema = {
    document: {},
    inlines: {
      concept: {
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
    switch (props.node.type) {
      case TYPE:
        return <EditSlateConcept {...props} locale={locale} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderInline,
  };
}
