/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { queryContent } from '../../../../modules/taxonomy/resources';
import { colors, spacing } from '@ndla/core';
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
  try {
    const resource = await queryContent(
      data['content-id'],
      language,
      contentType,
    );
    return `${language}/subjects${resource.path}`;
  } catch (error) {
    const fallbackPath =
      contentType === 'learningpath' ? 'learningpaths' : 'article';
    return `${language}/${fallbackPath}/${data['content-id']}`;
  }
};

const getModelFromNode = node => {
  const data = node.data ? node.data.toJS() : {};

  const contentType = data['content-type'] || 'article';
  const fallbackPath =
    contentType === 'learningpath' ? 'learningpaths' : 'article';

  const href =
    data.resource === 'content-link'
      ? `${config.editorialFrontendDomain}/${fallbackPath}/${
          data['content-id']
        }`
      : data.href;

  const checkbox =
    data.target === '_blank' || data['open-in'] === 'new-context';

  return {
    href,
    text: node.text,
    checkbox,
  };
};
class Link extends Component {
  constructor(props) {
    super(props);
    const existingModel = getModelFromNode(props.node, props.editor.value);
    this.state = {
      editMode: !(existingModel.href || existingModel['content-id']),
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.linkRef = React.createRef();
  }

  getMenuPosition() {
    if (this.linkRef.current) {
      const rect = this.linkRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  }

  toggleEditMode() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const {
      t,
      attributes,
      editor: { onChange, blur, value },
      node,
    } = this.props;

    const isInline = isNodeInCurrentSelection(value, node);

    const { top, left } = this.getMenuPosition();

    const model = getModelFromNode(node, value);
    const { href } = model;

    return (
      <span {...attributes}>
        <a {...classes('link')} href={href} ref={this.linkRef}>
          {this.props.children}
        </a>
        <Portal isOpened={isInline}>
          <StyledLinkMenu top={top} left={left}>
            <Button
              css={linkMenuButtonStyle}
              stripped
              onClick={this.toggleEditMode}>
              {t('form.content.link.change')}
            </Button>{' '}
            | {t('form.content.link.goTo')}{' '}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {' '}
              {href}
            </a>
          </StyledLinkMenu>
        </Portal>
        {this.state.editMode && (
          <EditLink
            {...this.props}
            model={model}
            closeEditMode={this.toggleEditMode}
            blur={blur}
            onChange={onChange}
          />
        )}
      </span>
    );
  }
}

Link.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(Link);
