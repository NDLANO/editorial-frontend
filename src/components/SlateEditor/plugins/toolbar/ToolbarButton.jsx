/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import {
  Bold,
  Code,
  Concept,
  Heading3,
  Heading2,
  Heading1,
  Italic,
  Link,
  ListCircle,
  ListNumbered,
  ListAlphabetical,
  Math,
  Quote,
  Section,
  Subscript,
  Superscript,
  Underline,
} from '@ndla/icons/editor';

import { css } from '@emotion/core';
import { toolbarClasses } from './SlateToolbar';

// Fetched from https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js
const IS_MAC =
  typeof window != 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
// @ndla/ui icon for Link type in toolbar has the same name as a link/anchor element component.
// Thus triggering a false positive, that we have to disable.
/* eslint-disable jsx-a11y/anchor-is-valid */
const options = { ctrl: IS_MAC ? 'cmd' : 'ctrl' };
const toolbarIcon = t => ({
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
  'heading-1': <Heading1 title={t('editorToolbar.headingOne', options)} />,
  'heading-2': <Heading2 title={t('editorToolbar.headingTwo', options)} />,
  'heading-3': <Heading3 title={t('editorToolbar.headingThree', options)} />,
  footnote: <Section title={t('editorToolbar.footnote', options)} />,
  mathml: <Math title={t('editorToolbar.mathml', options)} />,
  concept: <Concept title={t('editorToolbar.concept', options)} />,
  code: <Code title={t('editorToolbar.code', options)} />,
  'code-block': <Code title={t('editorToolbar.codeblock', options)} />,
});
/* eslint-enable jsx-a11y/anchor-is-valid */

const toolbarButtonStyle = isActive => css`
  display: inline-block;
  background: ${isActive ? colors.brand.lightest : colors.white};
  cursor: pointer;
  padding: 8px 0.5rem 8px 0.5rem;
  border-width: 0px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: ${isActive ? colors.brand.tertiary : colors.brand.greyLighter};

  .c-toolbar__button--active + & {
    border-left-width: 0px;
  }

  ${isActive && 'border-width: 1px;'}

  .c-toolbar__button--active + .c-toolbar__button--active {
    border-left-width: 0px;
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
const ToolbarButton = ({ isActive, type, kind, handleOnClick }) => {
  const { t } = useTranslation();
  const onMouseDown = e => handleOnClick(e, kind, type);
  return (
    <button
      {...toolbarClasses('button', isActive ? 'active' : '')}
      onMouseDown={onMouseDown}
      data-testid={`toolbar-button-${type}`}
      data-active={isActive}
      css={toolbarButtonStyle(isActive)}>
      <span {...toolbarClasses('icon', isActive ? 'active' : '')}>{toolbarIcon(t)[type]}</span>
    </button>
  );
};

ToolbarButton.propTypes = {
  type: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  handleOnClick: PropTypes.func.isRequired,
};

export default ToolbarButton;
