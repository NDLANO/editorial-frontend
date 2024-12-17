/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef } from "react";
import { styled } from "@ndla/styled-system/jsx";

const StyledSegmentHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBlockEnd: "2px solid",
    borderColor: "stroke.default",
  },
});

export const SegmentHeader = ({ children, ...rest }: ComponentPropsWithoutRef<"div">) => (
  <StyledSegmentHeader {...rest}>{children}</StyledSegmentHeader>
);
