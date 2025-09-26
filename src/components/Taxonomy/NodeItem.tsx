/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type Ref } from "react";
import { ark, HTMLArkProps } from "@ark-ui/react";
import { ArrowRightShortLine } from "@ndla/icons";
import { Heading, TextProps } from "@ndla/primitives";
import { cva, sva } from "@ndla/styled-system/css";
import { createStyleContext, StyledProps } from "@ndla/styled-system/jsx";

const nodeItemRecipe = sva({
  slots: ["root", "title", "toggleIcon"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "xxsmall",
      paddingBlock: "3xsmall",
      paddingInline: "4xsmall",
      paddingInlineStart: "calc(var(--level) * token(spacing.large))",
    },
    title: {
      textStyle: "label.medium",
      color: "text.default",
      textDecoration: "none",
      display: "flex",
      gap: "3xsmall",
      alignItems: "center",
      cursor: "pointer",
      _hover: {
        textDecoration: "underline",
      },
    },
    toggleIcon: {
      transformOrigin: "center",
      transitionDuration: "normal",
      transitionProperty: "transform",
      transitionTimingFunction: "default",
      fill: "icon.default",
      _open: {
        transform: "rotate(90deg)",
      },
    },
  },
  variants: {
    active: {
      true: {
        root: {
          background: "surface.brand.2.moderate",
        },
        title: { textDecoration: "underline" },
      },
      false: {
        root: {
          _hover: {
            background: "surface.hover",
          },
        },
      },
    },
    visible: {
      true: {
        title: {
          fontWeight: "semibold",
        },
      },
      false: {
        title: {
          color: "text.subtle",
          fontStyle: "italic",
        },
      },
    },
  },
});

const { withProvider, withContext } = createStyleContext(nodeItemRecipe);

export const NodeItemRoot = withProvider(ark.div, "root", { baseComponent: true });

interface InternalNodeItemTitleProps extends Omit<HTMLArkProps<"h1">, "color">, TextProps, StyledProps {
  ref?: Ref<HTMLHeadingElement>;
}

const InternalNodeItemTitle = ({ textStyle = "label.medium", ...props }: InternalNodeItemTitleProps) => (
  <Heading textStyle={textStyle} {...props} />
);

export const NodeItemTitle = withContext(InternalNodeItemTitle, "title");

const InternalToggleIcon = withContext(ArrowRightShortLine, "toggleIcon");

export const ToggleIcon = ({ hasChildNodes, isOpen }: { hasChildNodes: boolean; isOpen: boolean }) =>
  hasChildNodes ? <InternalToggleIcon {...(isOpen ? { "data-open": true } : {})} /> : null;

export const iconRecipe = cva({
  base: {
    fill: "icon.default",
  },
});
