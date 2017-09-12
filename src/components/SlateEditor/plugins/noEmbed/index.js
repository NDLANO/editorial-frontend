/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ForbiddenOverlay from './ForbiddenOverlay';

export default function createNoEmbedsPlugin() {
  const schema = {
    nodes: {
      embed: ForbiddenOverlay,
    },
  };

  return {
    schema,
  };
}
