/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, MouseEvent, ReactNode, useCallback, useMemo } from 'react';
import { colors, fonts } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
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
} from '@ndla/icons/editor';

import { Language } from '@ndla/icons/common';

const StyledHeadingSpan = styled.span`
  ${fonts.sizes('14px', '14px')};
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

const HeadingOne = ({ title }: HeadingProps) => <HeadingSpan title={title}>H1</HeadingSpan>;
const HeadingTwo = ({ title }: HeadingProps) => <HeadingSpan title={title}>H2</HeadingSpan>;
const HeadingThree = ({ title }: HeadingProps) => <HeadingSpan title={title}>H3</HeadingSpan>;
const HeadingFour = ({ title }: HeadingProps) => <HeadingSpan title={title}>H4</HeadingSpan>;

// Fetched from https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
const IS_MAC =
  typeof window != 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
const options = { ctrl: IS_MAC ? 'cmd' : 'ctrl' };

const icon: Record<string, ElementType> = {
  bold: Bold,
  italic: Italic,
  underlined: Underline,
  sub: Subscript,
  sup: Superscript,
  quote: Quote,
  link: Link,
  'numbered-list': ListNumbered,
  'bulleted-list': ListCircle,
  'letter-list': ListAlphabetical,
  'heading-1': HeadingOne,
  'heading-2': HeadingTwo,
  'heading-3': HeadingThree,
  'heading-4': HeadingFour,
  'definition-list': FormatList,
  mathml: Math,
  concept: Concept,
  code: Code,
  'code-block': Code,
  span: Language,
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
};

const StyledToolbarButton = styled.button`
  display: inline-block;
  background: ${colors.white};
  cursor: pointer;
  padding: 8px 0.5rem 8px 0.5rem;
  border-width: 0px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: ${colors.brand.greyLighter};
  &[data-active='true'] {
    background: ${colors.brand.lightest};
    border-width: 1px;
    border-color: ${colors.brand.tertiary};
  }

  :first-of-type {
    border-left-width: 1px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  :last-child {
    border-right-width: 1px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  :hover {
    background: ${colors.brand.lightest};
  }
`;

const ToolbarIcon = styled.span`
  vertical-align: text-bottom;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
`;

interface Props {
  isActive: boolean;
  type: string;
  kind: string;
  handleOnClick: (event: MouseEvent, kind: string, type: string) => void;
}

const ToolbarButton = ({ isActive, type, kind, handleOnClick }: Props) => {
  const Icon = useMemo(() => icon[type], [type]);
  const { t } = useTranslation();

  const onClick = useCallback(
    (e: MouseEvent) => handleOnClick(e, kind, type),
    [handleOnClick, kind, type],
  );

  return (
    <StyledToolbarButton
      onClick={onClick}
      data-testid={`toolbar-button-${type}`}
      data-active={isActive}
    >
      <ToolbarIcon>
        <Icon title={t(`editorToolbar.${type}`, options)} />
      </ToolbarIcon>
    </StyledToolbarButton>
  );
};

export default ToolbarButton;
