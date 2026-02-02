/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { ReactNode } from "react";
import DiffSeparator from "./DiffSeparator";
import { DiffResultType } from "./diffUtils";

interface Props {
  children?: ReactNode;
  left?: boolean;
  type: DiffResultType;
}

const StyledDiffInnerField = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "3xsmall",
    borderRadius: "xsmall",
  },
  variants: {
    variant: {
      ADDED: {
        background: "surface.success",
        color: "text.onAction",
      },
      MODIFIED: {
        background: "surface.warning",
      },
      DELETED: {
        background: "surface.error",
        color: "text.onAction",
      },
      NONE: {
        background: "transparent",
      },
    },
    position: {
      left: {},
      right: {},
    },
  },
  compoundVariants: [
    {
      position: "left",
      variant: ["ADDED", "MODIFIED", "NONE"],
      css: {
        background: "transparent",
        color: "text.default",
      },
    },
    {
      position: "right",
      variant: ["DELETED", "NONE"],
      css: {
        background: "transparent",
        color: "text.default",
      },
    },
  ],
});

export const DiffInnerField = ({ children, type, left }: Props) => {
  return (
    <StyledDiffInnerField variant={type} position={left ? "left" : "right"}>
      <DiffSeparator type={type} />
      {children}
    </StyledDiffInnerField>
  );
};

export const DiffField = styled("div", {
  base: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "1fr 1fr",
    gap: "xsmall",
  },
});
