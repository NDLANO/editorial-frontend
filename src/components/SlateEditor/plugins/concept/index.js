/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditConcept from './EditConcept';

export const TYPE = 'concept';

export default function linkPlugin(locale) {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case TYPE:
        return <EditConcept {...props} locale={locale} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
