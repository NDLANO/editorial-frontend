/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import SlateFigure from './SlateFigure';

export const defaultEmbedBlock = data =>
  Block.create({
    data,
    isVoid: true,
    type: 'embed',
  });

export const getSchemaEmbed = node => node.get('data').toJS();

export default function createEmbedPlugin(options = {}) {
  const schema = {
    nodes: {
      embed: props =>
        <SlateFigure deletedOnSave={options.deleteOnSave} {...props} />,
    },
  };

  return {
    schema,
  };
}
