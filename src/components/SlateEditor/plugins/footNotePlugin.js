/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import SlateFootNote from '../SlateFootNote';

// eslint-disable-next-line no-unused-vars
export default function footNotePlugin(options = {}) {
  const schema = {
    nodes: {
      footnote: props => <SlateFootNote {...props} />,
    },
  };
  return {
    schema,
  };
}
