/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper } from "@ndla/ui";

export const VideoWrapper = styled(EmbedWrapper, {
  base: {
    display: "block",
    _selected: {
      outline: "2px solid",
      outlineColor: "stroke.default",
    },
    "&[data-error='true']": {
      outlineColor: "stroke.error",
    },
  },
});
