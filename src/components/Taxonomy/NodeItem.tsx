/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { ark, HTMLArkProps } from "@ark-ui/react";
import { ArrowRightShortLine } from "@ndla/icons";
import { createStyleContext, Heading, TextProps } from "@ndla/primitives";
import { cva, sva } from "@ndla/styled-system/css";
import { JsxStyleProps, RecipeVariantProps } from "@ndla/styled-system/types";

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

type NodeItemVariantProps = RecipeVariantProps<typeof nodeItemRecipe>;

const InternalNodeItemRoot = withProvider<HTMLDivElement, HTMLArkProps<"div"> & JsxStyleProps & NodeItemVariantProps>(
  ark.div,
  "root",
  { baseComponent: true },
);

export const NodeItemRoot = forwardRef<HTMLDivElement, HTMLArkProps<"div"> & NodeItemVariantProps & JsxStyleProps>(
  ({ active, visible, ...props }, ref) => {
    return <InternalNodeItemRoot active={active} visible={visible} {...props} ref={ref} />;
  },
);

const InternalNodeItemTitle = forwardRef<HTMLHeadingElement, TextProps>(
  ({ textStyle = "label.medium", ...props }, ref) => <Heading textStyle={textStyle} {...props} ref={ref} />,
);

export const NodeItemTitle = withContext<HTMLHeadingElement, TextProps & HTMLArkProps<"h1"> & JsxStyleProps>(
  InternalNodeItemTitle,
  "title",
);

const InternalToggleIcon = withContext(ArrowRightShortLine, "toggleIcon");

export const ToggleIcon = ({ hasChildNodes, isOpen }: { hasChildNodes: boolean; isOpen: boolean }) =>
  hasChildNodes ? <InternalToggleIcon {...(isOpen ? { "data-open": true } : {})} /> : null;

export const iconRecipe = cva({
  base: {
    fill: "icon.default",
  },
});
