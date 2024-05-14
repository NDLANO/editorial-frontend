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
import styled from "@emotion/styled";
import { ButtonProps, ButtonV2 } from "@ndla/button";
import { colors, fonts, spacing } from "@ndla/core";
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

const StyledHeadingSpan = styled.span`
  text-align: center;
  width: ${spacing.normal};
  ${fonts.sizes("14px", "14px")};
`;

interface HeadingSpanProps {
  title: string;
  children: ReactNode;
}

const HeadingSpan = ({ title, children }: HeadingSpanProps) => {
  return <StyledHeadingSpan title={title}>{children}</StyledHeadingSpan>;
};

interface HeadingProps {
  title: string;
}

const Paragraph = ({ title }: HeadingProps) => <HeadingSpan title={title}>P</HeadingSpan>;
const HeadingOne = ({ title }: HeadingProps) => <HeadingSpan title={title}>H1</HeadingSpan>;
const HeadingTwo = ({ title }: HeadingProps) => <HeadingSpan title={title}>H2</HeadingSpan>;
const HeadingThree = ({ title }: HeadingProps) => <HeadingSpan title={title}>H3</HeadingSpan>;
const HeadingFour = ({ title }: HeadingProps) => <HeadingSpan title={title}>H4</HeadingSpan>;

// Fetched from https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
export const IS_MAC = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
const options = { ctrl: IS_MAC ? "cmd" : "ctrl" };

const icon: Record<string, ElementType> = {
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

const StyledButton = styled(ButtonV2)`
  color: ${colors.brand.greyDark};
  display: inline-flex;
  align-items: center;
  &[data-state="on"] {
    background-color: ${colors.brand.light};
    &:hover {
      color: ${colors.brand.greyDark};
    }
  }
`;

const getTitle = (
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

const ToolbarButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "type"> & Props>(
  ({ type, children, noTitle, disabled, ...rest }, ref) => {
    const Icon = useMemo(() => (type ? icon[type] : undefined), [type]);
    const { i18n, t } = useTranslation();

    const title = useMemo(() => getTitle(i18n, t, type, noTitle, disabled), [i18n, t, type, noTitle, disabled]);

    return (
      <StyledButton
        size="xsmall"
        ref={ref}
        variant="ghost"
        data-testid={`toolbar-button-${type}`}
        title={title}
        disabled={disabled}
        {...rest}
      >
        {Icon && <Icon />}
        {children}
      </StyledButton>
    );
  },
);

export default ToolbarButton;
