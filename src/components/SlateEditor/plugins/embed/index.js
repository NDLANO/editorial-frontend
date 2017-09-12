/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block } from 'slate';
import SlateFigure from './SlateFigure';
import ForbiddenOverlay from './ForbiddenOverlay';

export const defaultEmbedBlock = data =>
  Block.create({
    data,
    isVoid: true,
    type: 'embed',
  });

export const getSchemaEmbed = node => node.get('data').toJS();

export function createNoEmbedsPlugin() {
  const schema = {
    nodes: {
      embed: ForbiddenOverlay,
    },
  };

  return {
    schema,
  };
}

export default function createEmbedPlugin() {
  const schema = {
    nodes: {
      embed: SlateFigure,
    },
  };

  return {
    schema,
  };
}
