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

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: !this.hasHrefOrContentId(props.node),
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

  hasHrefOrContentId(node) {
    const data = node?.data?.toJS() || {};
    return !!(data.resource === 'content-link' || data.href);
  }

  async setStateFromNode() {
    const { node } = this.props;
    const data = node?.data?.toJS() || {};

    const contentType = data['content-type'] || 'article';

    const resourcePath = await fetchResourcePath(
      data,
      this.props.locale,
      contentType,
    );
    const href =
      data.resource === 'content-link'
        ? `${config.editorialFrontendDomain}/${resourcePath}`
        : data.href;

    const checkbox =
      data.target === '_blank' || data['open-in'] === 'new-context';

    const model = {
      href,
      text: node.text,
      checkbox,
    };

    this.setState({ model });
  }

  toggleEditMode() {
    this.setState(prevState => ({
      ...prevState,
      editMode: !prevState.editMode,
    }));
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

    this.setStateFromNode();
    if (!this.state.model) {
      return null;
    }

    const { href } = this.state.model;

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
            model={this.state.model}
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
  locale: PropTypes.string.isRequired,
};

export default injectT(Link);
