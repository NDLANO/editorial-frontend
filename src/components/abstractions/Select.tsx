/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type RefObject } from "react";
import {
  SelectIndicatorProps,
  SelectItemIndicator,
  SelectItemIndicatorProps,
  SelectItemProps,
  SelectTriggerProps,
} from "@ark-ui/react";
import { CloseLine, ArrowDownShortLine, CheckLine } from "@ndla/icons";
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

interface GenericSelectTriggerProps extends SelectTriggerProps, ButtonProps {
  ref?: RefObject<HTMLButtonElement>;
  clearable?: boolean;
}

export const GenericSelectTrigger = ({
  children,
  variant = "secondary",
  clearable,
  ref,
  ...props
}: GenericSelectTriggerProps) => (
  <SelectControl>
    <SelectTrigger asChild ref={ref} {...props}>
      <Button variant={variant}>
        {children}
        <GenericSelectIndicator />
      </Button>
    </SelectTrigger>

    {!!clearable && (
      <SelectClearTrigger asChild>
        <IconButton variant="secondary" size={props.size}>
          <CloseLine />
        </IconButton>
      </SelectClearTrigger>
    )}
  </SelectControl>
);

interface GenericSelectIndicatorProps extends SelectIndicatorProps, JsxStyleProps {
  ref?: RefObject<HTMLDivElement>;
}

export const GenericSelectIndicator = ({ children, ref, ...props }: GenericSelectIndicatorProps) => (
  <SelectIndicator ref={ref} {...props}>
    {children ?? <ArrowDownShortLine />}
  </SelectIndicator>
);

interface GenericSelectItemProps extends SelectItemProps, JsxStyleProps {
  ref?: RefObject<HTMLDivElement>;
}

export const GenericSelectItem = ({ children, ref, ...props }: GenericSelectItemProps) => (
  <SelectItem ref={ref} {...props}>
    <SelectItemText>{children}</SelectItemText>
    <GenericSelectItemIndicator />
  </SelectItem>
);

interface GenericSelectItemIndicatorProps extends SelectItemIndicatorProps, JsxStyleProps {
  ref?: RefObject<HTMLDivElement>;
}

export const GenericSelectItemIndicator = ({ children, ref, ...props }: GenericSelectItemIndicatorProps) => (
  <SelectItemIndicator ref={ref} {...props} asChild>
    {children ?? <CheckLine />}
  </SelectItemIndicator>
);
