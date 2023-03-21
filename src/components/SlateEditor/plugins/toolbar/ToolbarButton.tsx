/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import { colors, fonts } from '@ndla/core';
import { TFunction, useTranslation } from 'react-i18next';
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

// Fetched from https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
const IS_MAC =
  typeof window != 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
const options = { ctrl: IS_MAC ? 'cmd' : 'ctrl' };
const toolbarIcon = (t: TFunction): Record<string, JSX.Element | undefined> => ({
  bold: <Bold title={t('editorToolbar.bold', options)} />,
  italic: <Italic title={t('editorToolbar.italic', options)} />,
  underlined: <Underline title={t('editorToolbar.underlined', options)} />,
  sub: <Subscript title={t('editorToolbar.sub', options)} />,
  sup: <Superscript title={t('editorToolbar.sup', options)} />,
  quote: <Quote title={t('editorToolbar.quote', options)} />,
  link: <Link title={t('editorToolbar.link', options)} />,
  'numbered-list': <ListNumbered title={t('editorToolbar.numberedList', options)} />,
  'bulleted-list': <ListCircle title={t('editorToolbar.bulletedList', options)} />,
  'letter-list': <ListAlphabetical title={t('editorToolbar.letterList', options)} />,
  'heading-1': <StyledHeadingSpan>H1</StyledHeadingSpan>,
  'heading-2': <StyledHeadingSpan>H2</StyledHeadingSpan>,
  'heading-3': <StyledHeadingSpan>H3</StyledHeadingSpan>,
  'heading-4': <StyledHeadingSpan>H4</StyledHeadingSpan>,
  'definition-list': <FormatList title={t('editortoolbar.definitionList', options)} />,
  mathml: <Math title={t('editorToolbar.mathml', options)} />,
  concept: <Concept title={t('editorToolbar.concept', options)} />,
  code: <Code title={t('editorToolbar.code', options)} />,
  'code-block': <Code title={t('editorToolbar.codeblock', options)} />,
  span: <Language title={t('editorToolbar.lang', options)} />,
  left: <AlignLeft title={t('editorToolbar.leftAlign', options)} />,
  center: <AlignCenter title={t('editorToolbar.centerAlign', options)} />,
  right: <AlignRight title={t('editorToolbar.rightAlign', options)} />,
});

const StyledToolbarButton = styled.button<{ isActive: boolean }>`
  display: inline-block;
  background: ${props => (props.isActive ? colors.brand.lightest : colors.white)};
  cursor: pointer;
  padding: 8px 0.5rem 8px 0.5rem;
  border-width: 0px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: ${props => (props.isActive ? colors.brand.tertiary : colors.brand.greyLighter)};
  ${props => props.isActive && 'border-width: 1px;'};

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
  const { t } = useTranslation();
  const onMouseDown = (e: MouseEvent) => handleOnClick(e, kind, type);
  return (
    <StyledToolbarButton
      onMouseDown={onMouseDown}
      data-testid={`toolbar-button-${type}`}
      data-active={isActive}
      isActive={isActive}>
      <ToolbarIcon>{toolbarIcon(t)[type]}</ToolbarIcon>
    </StyledToolbarButton>
  );
};

export default ToolbarButton;
