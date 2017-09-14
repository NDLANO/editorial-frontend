/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import NoEmbedMessage from './NoEmbedMessage';

export default function createNoEmbedsPlugin() {
  const schema = {
    nodes: {
      embed: NoEmbedMessage,
    },
  };

  return {
    schema,
  };
}
