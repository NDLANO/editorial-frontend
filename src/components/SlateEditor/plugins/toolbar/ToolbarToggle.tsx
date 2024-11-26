/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { ElementType, ReactNode, forwardRef, useMemo } from "react";
import { CustomI18n, useTranslation } from "react-i18next";
import { ToggleGroupItemProps } from "@ark-ui/react";
import { Language, Comment } from "@ndla/icons/common";
import {
  Bold,
  Code,
  Concept,
  Italic,
  Link,
  ListCircle,
  ListNumbered,
  ListAlphabetical,
  Math,
  Quote,
  Subscript,
  Superscript,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FormatList,
  Globe,
} from "@ndla/icons/editor";
import { IconButton, Text, ToggleGroupItem, ToggleGroupRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FontWeightToken } from "@ndla/styled-system/tokens";

interface HeadingProps {
  title: string;
  fontWeight?: FontWeightToken;
}

interface HeadingSpanProps extends HeadingProps {
  children: ReactNode;
}

const StyledText = styled(Text, {
  base: {
    width: "medium",
    height: "medium",
  },
});

const HeadingSpan = ({ children, ...rest }: HeadingSpanProps) => {
  return (
    <StyledText {...rest} consumeCss asChild>
      <span>{children}</span>
    </StyledText>
  );
};

const Paragraph = (props: HeadingProps) => <HeadingSpan {...props}>P</HeadingSpan>;
const HeadingOne = (props: HeadingProps) => <HeadingSpan {...props}>H1</HeadingSpan>;
const HeadingTwo = (props: HeadingProps) => <HeadingSpan {...props}>H2</HeadingSpan>;
const HeadingThree = (props: HeadingProps) => <HeadingSpan {...props}>H3</HeadingSpan>;
const HeadingFour = (props: HeadingProps) => <HeadingSpan {...props}>H4</HeadingSpan>;

// Fetched from https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
export const IS_MAC = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
const options = { ctrl: IS_MAC ? "cmd" : "ctrl" };

export const iconMapping: Record<string, ElementType> = {
  bold: Bold,
  italic: Italic,
  underlined: Underline,
  sub: Subscript,
  sup: Superscript,
  quote: Quote,
  "content-link": Link,
  "numbered-list": ListNumbered,
  "bulleted-list": ListCircle,
  "letter-list": ListAlphabetical,
  "heading-1": HeadingOne,
  "heading-2": HeadingTwo,
  "heading-3": HeadingThree,
  "heading-4": HeadingFour,
  "normal-text": Paragraph,
  "definition-list": FormatList,
  "comment-inline": Comment,
  mathml: Math,
  "concept-inline": Concept,
  "gloss-inline": Globe,
  code: Code,
  "code-block": Code,
  language: Language,
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
};

interface Props {
  type?: string;
  noTitle?: boolean;
  disabled?: boolean;
}

export const getTitle = (
  i18n: CustomI18n,
  t: TFunction,
  type?: string,
  noTitle?: boolean,
  disabled?: boolean,
): string | undefined => {
  if (noTitle) return;

  if (disabled) {
    const disabledTranslation = `editorToolbar.disabled.${type}`;
    const translationExists = i18n.exists(disabledTranslation);

    if (translationExists) return t(disabledTranslation);
  }

  return t(`editorToolbar.${type}`, options);
};

export const ToolbarToggleButton = forwardRef<HTMLButtonElement, Omit<ToggleGroupItemProps, "type"> & Props>(
  ({ type, children, noTitle, disabled, value, ...rest }, ref) => {
    const Icon = useMemo(() => (type ? iconMapping[type] : undefined), [type]);
    const { i18n, t } = useTranslation();

    const title = useMemo(() => getTitle(i18n, t, type, noTitle, disabled), [i18n, t, type, noTitle, disabled]);

    return (
      <ToggleGroupItem
        data-testid={`toolbar-button-${type}`}
        title={title}
        disabled={disabled}
        ref={ref}
        value={value}
        {...rest}
        asChild
      >
        <IconButton size="small" variant="tertiary">
          {Icon && <Icon />}
          {children}
        </IconButton>
      </ToggleGroupItem>
    );
  },
);

export const ToolbarToggleGroupRoot = styled(ToggleGroupRoot, {
  base: {
    gap: "3xsmall",
  },
});
