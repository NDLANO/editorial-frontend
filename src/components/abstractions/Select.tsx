/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { type Ref } from "react";

interface GenericSelectTriggerProps extends SelectTriggerProps, ButtonProps {
  ref?: Ref<HTMLButtonElement>;
  clearable?: boolean;
}

export const GenericSelectTrigger = ({
  children,
  variant = "secondary",
  clearable,
  ...props
}: GenericSelectTriggerProps) => (
  <SelectControl>
    <SelectTrigger asChild {...props}>
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
  ref?: Ref<HTMLDivElement>;
}

export const GenericSelectIndicator = ({ children, ...props }: GenericSelectIndicatorProps) => (
  <SelectIndicator {...props}>{children ?? <ArrowDownShortLine />}</SelectIndicator>
);

interface GenericSelectItemProps extends SelectItemProps, JsxStyleProps {
  ref?: Ref<HTMLDivElement>;
}

export const GenericSelectItem = ({ children, ...props }: GenericSelectItemProps) => (
  <SelectItem {...props}>
    <SelectItemText>{children}</SelectItemText>
    <GenericSelectItemIndicator />
  </SelectItem>
);

interface GenericSelectItemIndicatorProps extends SelectItemIndicatorProps, JsxStyleProps {
  ref?: Ref<HTMLDivElement>;
}

export const GenericSelectItemIndicator = ({ children, ...props }: GenericSelectItemIndicatorProps) => (
  <SelectItemIndicator {...props} asChild>
    {children ?? <CheckLine />}
  </SelectItemIndicator>
);
