/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing } from '@ndla/core';
import config from '../../../../config';
import { toEditArticle, toLearningpathFull } from '../../../../util/routeHelpers';
import { Portal } from '../../../Portal';
import isNodeInCurrentSelection from '../../utils/isNodeInCurrentSelection';
import { EditorShape } from '../../../../shapes';
import { classes } from '../../RichTextEditor';
import EditLink from './EditLink';

const linkMenuButtonStyle = css`
  color: ${colors.brand.primary};
  text-decoration: underline;
`;
const StyledLinkMenu = styled('span')`
  position: absolute;
  top: ${p => p.top}px;
  left: ${p => p.left}px;
  padding: calc(${spacing.small} / 2);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid ${colors.brand.greyLight};
  z-index: 1;
`;

const fetchResourcePath = async (data, language, contentType) => {
  const id = data['content-id'];
  return contentType === 'learningpath'
    ? toLearningpathFull(id, language)
    : `${config.editorialFrontendDomain}${toEditArticle(id, contentType)}`;
};

function hasHrefOrContentId(node) {
  const data = node?.data?.toJS() || {};
  return !!(data.resource === 'content-link' || data.href);
}

const Link = props => {
  const {t} = useTranslation();
  const {
    attributes,
    editor: { onChange, blur, value },
    node,
    language,
  } = props;
  const linkRef = useRef(null);
  const [model, setModel] = useState(null);
  const [editMode, setEditMode] = useState(!hasHrefOrContentId(node));

  const getMenuPosition = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  useEffect(() => {
    const setStateFromNode = async () => {
      const data = node?.data?.toJS() || {};

      const contentType = data['content-type'] || 'article';

      const href =
        data.resource === 'content-link'
          ? `${await fetchResourcePath(data, language, contentType)}`
          : data.href;

      const checkbox = data.target === '_blank' || data['open-in'] === 'new-context';

      setModel({
        href,
        text: node.text,
        checkbox,
      });
    };
    setStateFromNode();
  }, [node, language]);

  if (!model) {
    return null;
  }

  const { top, left } = getMenuPosition();
  const isInline = isNodeInCurrentSelection(value, node);
  const { href } = model;

  return (
    <span {...attributes}>
      <a {...classes('link')} href={href} ref={linkRef}>
        {props.children}
      </a>
      <Portal isOpened={isInline}>
        <StyledLinkMenu top={top} left={left}>
          <Button css={linkMenuButtonStyle} stripped onClick={toggleEditMode}>
            {t('form.content.link.change')}
          </Button>{' '}
          | {t('form.content.link.goTo')}{' '}
          <a href={href} target="_blank" rel="noopener noreferrer">
            {' '}
            {href}
          </a>
        </StyledLinkMenu>
      </Portal>
      {editMode && (
        <EditLink
          {...props}
          model={model}
          closeEditMode={toggleEditMode}
          blur={blur}
          onChange={onChange}
        />
      )}
    </span>
  );
};

Link.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: Types.node.isRequired,
  language: PropTypes.string.isRequired,
};

export default Link;
