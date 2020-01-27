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
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing } from '@ndla/core';
import { queryContent } from '../../../../modules/taxonomy/resources';
import config from '../../../../config';
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
  const fallbackType =
    contentType === 'learningpath' ? 'learningpaths' : 'article';
  const fallbackPath = `${language}/${fallbackType}/${data['content-id']}`;
  try {
    const resource = await queryContent(
      data['content-id'],
      language,
      contentType,
    );
    return resource.path
      ? `${language}/subjects${resource.path}`
      : fallbackPath;
  } catch (error) {
    return fallbackPath;
  }
};

function hasHrefOrContentId(node) {
  const data = node?.data?.toJS() || {};
  return !!(data.resource === 'content-link' || data.href);
}

const Link = props => {
  const {
    t,
    attributes,
    editor: { onChange, blur, value },
    node,
    locale,
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

  const setStateFromNode = async () => {
    const { node } = props;
    const data = node?.data?.toJS() || {};

    const contentType = data['content-type'] || 'article';

    const resourcePath = await fetchResourcePath(data, locale, contentType);
    const href =
      data.resource === 'content-link'
        ? `${config.editorialFrontendDomain}/${resourcePath}`
        : data.href;

    const checkbox =
      data.target === '_blank' || data['open-in'] === 'new-context';

    setModel({
      href,
      text: node.text,
      checkbox,
    });
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  useEffect(() => {
    setStateFromNode();
  }, [node]);

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
  locale: PropTypes.string.isRequired,
};

export default injectT(Link);
