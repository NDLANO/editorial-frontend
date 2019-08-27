/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { textBlockValidationRules } from '../../utils';
import SlateAside from './SlateAside';

export default function createAside() {
  const schema = {
    blocks: {
      aside: textBlockValidationRules,
    },
  };

  /* eslint-disable react/prop-types */
  const renderBlock = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'aside':
        return <SlateAside {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderBlock,
  };
}
