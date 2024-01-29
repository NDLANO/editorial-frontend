/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, ReactNode, forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonProps, ButtonV2 } from "@ndla/button";
import { colors, fonts, spacing } from "@ndla/core";
import { Language } from "@ndla/icons/common";
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
  mathml: Math,
  "concept-inline": Concept,
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

const ToolbarButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "type"> & Props>(
  ({ type, children, noTitle, ...rest }, ref) => {
    const Icon = useMemo(() => (type ? icon[type] : undefined), [type]);
    const { t } = useTranslation();

    return (
      <StyledButton
        size="xsmall"
        ref={ref}
        variant="ghost"
        data-testid={`toolbar-button-${type}`}
        title={noTitle ? undefined : t(`editorToolbar.${type}`, options)}
        {...rest}
      >
        {Icon && <Icon />}
        {children}
      </StyledButton>
    );
  },
);

export default ToolbarButton;
