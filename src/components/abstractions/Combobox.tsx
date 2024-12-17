/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, forwardRef } from "react";
import { CloseLine, ArrowDownShortLine, CheckLine, ImageLine } from "@ndla/icons";
import {
  ComboboxClearTrigger,
  ComboboxControl,
  ComboboxInput,
  ComboboxInputProps,
  ComboboxItemIndicator,
  ComboboxItemIndicatorProps,
  ComboboxItemText,
  ComboboxTrigger,
  IconButton,
  Input,
  InputContainer,
  InputProps,
  ListItemContent,
  ListItemImage,
  ListItemProps,
  ListItemRoot,
  Spinner,
  Text,
} from "@ndla/primitives";
import { Flex, styled } from "@ndla/styled-system/jsx";

export const GenericComboboxItemIndicator = forwardRef<HTMLDivElement, ComboboxItemIndicatorProps>(
  ({ children, ...props }, ref) => (
    <ComboboxItemIndicator ref={ref} {...props} asChild>
      {children ?? <CheckLine />}
    </ComboboxItemIndicator>
  ),
);

export interface GenericComboboxInputProps extends ComboboxInputProps {
  clearable?: boolean;
  triggerable?: boolean;
  isFetching?: boolean;
}

export const GenericComboboxInput = forwardRef<HTMLInputElement, GenericComboboxInputProps & InputProps>(
  ({ clearable, componentSize, isFetching, triggerable, ...props }, ref) => {
    return (
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput asChild ref={ref} {...props}>
            <Input componentSize={componentSize} />
          </ComboboxInput>
          {!!isFetching && <Spinner size="small" />}
          {!!clearable && (
            <ComboboxClearTrigger asChild>
              <IconButton variant="clear" size={componentSize}>
                <CloseLine />
              </IconButton>
            </ComboboxClearTrigger>
          )}
        </InputContainer>

        {!!triggerable && (
          <ComboboxTrigger asChild>
            <IconButton variant="secondary" size={componentSize}>
              <ArrowDownShortLine />
            </IconButton>
          </ComboboxTrigger>
        )}
      </ComboboxControl>
    );
  },
);

interface GenericComboboxItemProps {
  title: string;
  description?: string;
  fallbackImageElement?: ReactNode;
  useFallbackImage?: boolean;
  image?: {
    url?: string;
    alt?: string;
  };
}

const StyledText = styled(Text, {
  base: {
    lineClamp: "2",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    _disabled: {
      _hover: {
        backgroundColor: "surface.selected",
      },
    },
  },
});

const StyledImageLine = styled(ImageLine, {
  base: {
    fill: "stroke.default",
  },
});

export const GenericComboboxItemContent = forwardRef<HTMLDivElement, GenericComboboxItemProps & ListItemProps>(
  ({ title, image, description, fallbackImageElement, useFallbackImage, ...props }, ref) => (
    <StyledListItemRoot context="list" ref={ref} {...props}>
      {!!(!!image || useFallbackImage) && (
        <ListItemImage
          src={image?.url ?? ""}
          alt={image?.alt ?? ""}
          fallbackElement={fallbackImageElement ?? <StyledImageLine />}
        />
      )}
      <ListItemContent>
        <Flex direction="column">
          <ComboboxItemText color="text.default">{title}</ComboboxItemText>
          {!!description && (
            <StyledText textStyle="label.small" color="text.subtle">
              {description}
            </StyledText>
          )}
        </Flex>
        <GenericComboboxItemIndicator />
      </ListItemContent>
    </StyledListItemRoot>
  ),
);
