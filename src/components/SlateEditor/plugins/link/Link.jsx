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
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Portal } from '../../../../components/Portal';
import { setActiveNode } from '../../createSlateStore';
import isNodeInCurrentSelection from '../utils/isNodeInCurrentSelection';
import { EditorShape } from '../../../../shapes';
import { classes } from '../../RichTextEditor';

class Link extends Component {
  // shouldNodeComponentUpdate does'nt allow consistent return
  // eslint-disable-next-line consistent-return
  static shouldNodeComponentUpdate(previousProps, nextProps) {
    const { state: previousEditorState } = previousProps;
    const { state: nextEditorState } = nextProps;
    // return true here to trigger a re-render
    if (previousEditorState.inlines !== nextEditorState.inlines) return true;
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
      state: editorState,
      editor: { props: { slateStore } },
      node,
    } = this.props;
    const data = node.data.toJS();

    const isInline = isNodeInCurrentSelection(editorState, node);

    const { top, left } = this.getMenuPosition();

    const href =
      data.resource === 'content-link'
        ? `${window.config.editorialFrontendDomain}/article/${
            data['content-id']
          }`
        : data.href;

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
              onClick={() => slateStore.dispatch(setActiveNode(node))}>
              {t('form.content.link.change')}
            </Button>{' '}
            | {t('form.content.link.goTo')}{' '}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {' '}
              {href}
            </a>
          </span>
        </Portal>
      </span>
    );
  }
}

Link.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  state: Types.state.isRequired,
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(Link);
