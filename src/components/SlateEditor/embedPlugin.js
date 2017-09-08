/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SlateFigure from './SlateFigure';

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
