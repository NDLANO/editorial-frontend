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
import Button from 'ndla-button';
import { injectT } from 'ndla-i18n';
import config from '../../../../config';
import { Portal } from '../../../Portal';
import isNodeInCurrentSelection from '../../utils/isNodeInCurrentSelection';
import { EditorShape } from '../../../../shapes';
import { classes } from '../../RichTextEditor';
import EditLink from './EditLink';

const getModelFromNode = (node, value) => {
  const { start, end, focusText } = value.selection;
  const data = node.data ? node.data.toJS() : {};
  const text = node.text
    ? node.text
    : focusText.text.slice(start.offset, end.offset);

  const href =
    data.resource === 'content-link'
      ? `${config.editorialFrontendDomain}/article/${data['content-id']}`
      : data.href;

  const checkbox =
    data.target === '_blank' || data['open-in'] === 'new-context';

  return {
    href,
    text,
    checkbox,
  };
};
class Link extends Component {
  constructor(props) {
    super(props);
    const existingLink = props.node.data.toJS();
    this.state = {
      editMode: !(existingLink.href || existingLink['content-id']),
    };
  }

  getMenuPosition() {
    if (this.linkRef) {
      const rect = this.linkRef.getBoundingClientRect();
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

  render() {
    const {
      t,
      attributes,
      value: EditorValue,
      editor: {
        props: { slateStore },
        onChange,
        blur,
      },
      node,
      value,
    } = this.props;

    const isInline = isNodeInCurrentSelection(EditorValue, node);
    const { top, left } = this.getMenuPosition();

    const model = node ? getModelFromNode(node, value) : {};
    const { href } = model;

    return (
      <span>
        <a
          {...classes('link')}
          href={href}
          ref={linkRef => {
            this.linkRef = linkRef;
          }}
          {...attributes}>
          {this.props.children}
        </a>
        <Portal isOpened={isInline}>
          <span
            className="c-link-menu"
            style={{ top: `${top}px`, left: `${left}px` }}>
            <Button
              stripped
              onClick={() =>
                this.setState(prevState => ({ editMode: !prevState.editMode }))
              }>
              {t('form.content.link.change')}
            </Button>{' '}
            | {t('form.content.link.goTo')}{' '}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {' '}
              {href}
            </a>
          </span>
        </Portal>
        {this.state.editMode && (
          <EditLink
            {...this.props}
            model={model}
            closeEditMode={() => this.setState({ editMode: false })}
            blur={blur}
            slateStore={slateStore}
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
  value: Types.value.isRequired,
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(Link);
