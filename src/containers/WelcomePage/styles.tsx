/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const StyledTopRowDashboardInfo = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    tabletDown: {
      flexDirection: "column",
    },
  },
});

export const ControlWrapperDashboard = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    tabletDown: {
      flexDirection: "row",
    },
  },
});

export const TopRowControls = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "xxsmall",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    tabletDown: {
      justifyContent: "flex-start",
    },
  },
});
