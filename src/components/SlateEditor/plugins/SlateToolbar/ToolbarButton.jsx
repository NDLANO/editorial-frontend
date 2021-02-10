/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { toKeyName } from 'is-hotkey';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
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
// @ndla/ui icon for Link type in toolbar has the same name as a link/anchor element component.
// Thus triggering a false positive, that we have to disable.
/* eslint-disable jsx-a11y/anchor-is-valid */
const options = { ctrl: toKeyName('ctrl'), alt: toKeyName('alt') };
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
  'heading-one': <Heading1 title={t('editorToolbar.headingOne', options)} />,
  'heading-two': <Heading2 title={t('editorToolbar.headingTwo', options)} />,
  'heading-three': <Heading3 title={t('editorToolbar.headingThree', options)} />,
  footnote: <Section title={t('editorToolbar.footnote', options)} />,
  mathml: <Math title={t('editorToolbar.mathml', options)} />,
  concept: <Concept title={t('editorToolbar.concept', options)} />,
  code: <Code title={t('editorToolbar.code', options)} />,
  'code-block': <Code title={t('editorToolbar.codeblock', options)} />,
});
/* eslint-enable jsx-a11y/anchor-is-valid */

const toolbarButtonStyle = css`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;
`;
const ToolbarButton = ({ isActive, type, kind, handleOnClick, t }) => {
  const onMouseDown = e => handleOnClick(e, kind, type);
  return (
    <Button
      stripped
      onMouseDown={onMouseDown}
      data-testid={`toolbar-button-${type}`}
      data-active={isActive}
      css={toolbarButtonStyle}>
      <span {...toolbarClasses('icon', isActive ? 'active' : '')}>{toolbarIcon(t)[type]}</span>
    </Button>
  );
};

ToolbarButton.propTypes = {
  type: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  handleOnClick: PropTypes.func.isRequired,
};

export default injectT(ToolbarButton);
