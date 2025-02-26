/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const StyledFigureButtons = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: "xxsmall",
    top: "xxsmall",
    gap: "xsmall",
    zIndex: "docked",
  },
});
