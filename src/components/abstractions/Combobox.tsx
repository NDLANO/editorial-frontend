/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, type Ref } from "react";
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

interface GenericComboboxItemIndicatorProps extends ComboboxItemIndicatorProps {
  ref?: Ref<HTMLDivElement>;
}

export const GenericComboboxItemIndicator = ({ children, ...props }: GenericComboboxItemIndicatorProps) => (
  <ComboboxItemIndicator {...props} asChild>
    {children ?? <CheckLine />}
  </ComboboxItemIndicator>
);

export interface GenericComboboxInputProps extends ComboboxInputProps, InputProps {
  ref?: Ref<HTMLInputElement>;
  clearable?: boolean;
  triggerable?: boolean;
  isFetching?: boolean;
}

export const GenericComboboxInput = ({
  clearable,
  componentSize,
  isFetching,
  triggerable,
  ...props
}: GenericComboboxInputProps) => {
  return (
    <ComboboxControl>
      <InputContainer>
        <ComboboxInput asChild {...props}>
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
};

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

interface GenericComboboxItemCustomProps {
  title: string;
  description?: string;
  fallbackImageElement?: ReactNode;
  useFallbackImage?: boolean;
  image?: {
    url?: string;
    alt?: string;
  };
}

type GenericComboboxItemProps = GenericComboboxItemCustomProps & ListItemProps & { ref?: Ref<HTMLDivElement> };

export const GenericComboboxItemContent = ({
  title,
  image,
  description,
  fallbackImageElement,
  useFallbackImage,
  ...props
}: GenericComboboxItemProps) => (
  <StyledListItemRoot context="list" {...props}>
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
);
