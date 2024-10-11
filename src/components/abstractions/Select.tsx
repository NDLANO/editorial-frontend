/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import {
  SelectIndicatorProps,
  SelectItemIndicator,
  SelectItemIndicatorProps,
  SelectItemProps,
  SelectTriggerProps,
} from "@ark-ui/react";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  Button,
  ButtonProps,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from "@ndla/primitives";
import { JsxStyleProps } from "@ndla/styled-system/types";

export const GenericSelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps & ButtonProps>(
  ({ children, variant = "secondary", ...props }, ref) => (
    <SelectControl>
      <SelectTrigger asChild ref={ref} {...props}>
        <Button variant={variant}>
          {children}
          <GenericSelectIndicator />
        </Button>
      </SelectTrigger>
    </SelectControl>
  ),
);

export const GenericSelectIndicator = forwardRef<HTMLDivElement, SelectIndicatorProps & JsxStyleProps>(
  ({ children, ...props }, ref) => (
    <SelectIndicator ref={ref} {...props}>
      {children ?? <ArrowDownShortLine />}
    </SelectIndicator>
  ),
);

export const GenericSelectItem = forwardRef<HTMLDivElement, SelectItemProps & JsxStyleProps>(
  ({ children, ...props }, ref) => (
    <SelectItem ref={ref} {...props}>
      <SelectItemText>{children}</SelectItemText>
      <GenericSelectItemIndicator />
    </SelectItem>
  ),
);

export const GenericSelectItemIndicator = forwardRef<HTMLDivElement, SelectItemIndicatorProps & JsxStyleProps>(
  ({ children, ...props }, ref) => (
    <SelectItemIndicator ref={ref} {...props} asChild>
      {children ?? <CheckLine />}
    </SelectItemIndicator>
  ),
);
