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
import { CloseLine } from "@ndla/icons/action";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  Button,
  ButtonProps,
  IconButton,
  SelectClearTrigger,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from "@ndla/primitives";
import { JsxStyleProps } from "@ndla/styled-system/types";

interface GenericSelectTriggerProps {
  clearable?: boolean;
}

export const GenericSelectTrigger = forwardRef<
  HTMLButtonElement,
  SelectTriggerProps & ButtonProps & GenericSelectTriggerProps
>(({ children, variant = "secondary", clearable, ...props }, ref) => (
  <SelectControl>
    <SelectTrigger asChild ref={ref} {...props}>
      <Button variant={variant}>
        {children}
        <GenericSelectIndicator />
      </Button>
    </SelectTrigger>

    {clearable && (
      <SelectClearTrigger asChild>
        <IconButton variant="secondary">
          <CloseLine />
        </IconButton>
      </SelectClearTrigger>
    )}
  </SelectControl>
));

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
