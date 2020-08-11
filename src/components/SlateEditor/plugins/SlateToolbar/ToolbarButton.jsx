/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
  Underline,
} from '@ndla/icons/editor';

import { css } from '@emotion/core';
import { toolbarClasses } from './SlateToolbar';
// @ndla/ui icon for Link type in toolbar has the same name as a link/anchor element component.
// Thus triggering a false positive, that we have to disable.
/* eslint-disable jsx-a11y/anchor-is-valid */
const toolbarIcon = t => ({
  bold: <Bold title={t('editorToolbar.bold')} />,
  italic: <Italic title={t('editorToolbar.italic')} />,
  underlined: <Underline title={t('editorToolbar.underlined')} />,
  quote: <Quote title={t('editorToolbar.quote')} />,
  link: <Link title={t('editorToolbar.link')} />,
  'numbered-list': <ListNumbered title={t('editorToolbar.numberedList')} />,
  'bulleted-list': <ListCircle title={t('editorToolbar.bulletedList')} />,
  'letter-list': <ListAlphabetical title={t('editorToolbar.letterList')} />,
  'heading-one': <Heading1 title={t('editorToolbar.headingOne')} />,
  'heading-two': <Heading2 title={t('editorToolbar.headingTwo')} />,
  'heading-three': <Heading3 title={t('editorToolbar.headingThree')} />,
  footnote: <Section title={t('editorToolbar.footnote')} />,
  mathml: <Math title={t('editorToolbar.mathml')} />,
  concept: <Concept title={t('editorToolbar.concept')} />,
  code: <Code title="Ikke formatert kodeblokk" />, // todo fix
  'code-block': <Code title="Kodeblokk" />,
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
      <span {...toolbarClasses('icon', isActive ? 'active' : '')}>
        {toolbarIcon(t)[type]}
      </span>
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
