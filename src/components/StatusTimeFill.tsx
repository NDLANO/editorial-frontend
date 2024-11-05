/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TimeFill } from "@ndla/icons/common";
import { styled } from "@ndla/styled-system/jsx";

export const StatusTimeFill = styled(TimeFill, {
  variants: {
    variant: {
      warn: {
        fill: "surface.warning",
      },
      expired: {
        fill: "surface.danger",
      },
    },
  },
});
