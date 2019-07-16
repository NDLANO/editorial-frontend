/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { findDOMNode } from 'slate-react';
import PropTypes from 'prop-types';
import { injectT, formatNestedMessages } from '@ndla/i18n';
import { SlateBlockMenu } from '@ndla/editor';
import { Portal } from '../../../Portal';
import { defaultBlocks } from '../../utils';
import { defaultBodyBoxBlock } from '../bodybox';
import { defaultDetailsBlock, defaultSolutionboxBlock } from '../details';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import actions from './actions';
import { getLocaleObject } from '../../../../i18n';

const { defaultAsideBlock, defaultRelatedBlock } = defaultBlocks;

const getSectionElementInEditor = nodeEl => {
  const maxIterations = 8;
  let iterations = 0;
  let element = nodeEl;
  while (maxIterations > iterations) {
    element = element.parentNode;
    if (!element || !element.parentNode) {
      return undefined;
    }
    if (element.tagName.toLowerCase() === 'section') {
      return element;
    }
    iterations = iterations + 1;
  }
};

class SlateBlockPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      visualElementSelect: {
        isOpen: false,
      },
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onElementAdd = this.onElementAdd.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.focusInsideIllegalArea = this.focusInsideIllegalArea.bind(this);
    this.onVisualElementClose = this.onVisualElementClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.getFactboxTitle = this.getFactboxTitle.bind(this);
    this.getActionsForArea = this.getActionsForArea.bind(this);
    this.slateBlockRef = React.createRef();
    this.slateBlockButtonRef = React.createRef();
    this.zIndexTimeout = null;
  }

  componentDidMount() {
    this.slateBlockRef.current.style.transition = 'opacity 200ms ease';
    this.slateBlockRef.current.style.position = 'absolute';
    this.showPicker();
  }

  componentDidUpdate() {
    this.showPicker();
  }

  onVisualElementClose() {
    this.setState({
      visualElementSelect: { isOpen: false, visualElementType: '' },
    });
  }

  onInsertBlock(block) {
    const { editor } = this.props;
    editor.insertBlock(block);
  }

  onElementAdd(block) {
    const { editor, addSection } = this.props;
    switch (block.type) {
      case 'block': {
        addSection();
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
        break;
      }
      case 'solutionbox': {
        this.onInsertBlock(defaultSolutionboxBlock(this.getFactboxTitle()));
        break;
      }
      case 'details': {
        this.onInsertBlock(defaultDetailsBlock());
        break;
      }
      case 'table': {
        editor.insertTable(2, 2);
        break;
      }
      case 'aside': {
        this.onInsertBlock(defaultAsideBlock(block.object));
        break;
      }
      case 'file':
      case 'embed': {
        this.setState({
          visualElementSelect: {
            isOpen: true,
            visualElementType: block.object,
          },
        });
        break;
      }
      case 'related': {
        this.onInsertBlock(defaultRelatedBlock());
        break;
      }
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  getDerviedStateFromProps(nextProps, prevState) {
    if (!nextProps.editor.isFocused && prevState.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  toggleIsOpen(isOpen) {
    this.setState({ isOpen });
  }

  getFactboxTitle() {
    const { articleLanguage } = this.props;
    const localeObject = getLocaleObject(articleLanguage);
    const messages = formatNestedMessages(localeObject.messages);
    return messages['editorBlockpicker.actions.solutionbox'];
  }

  update(nodeEl) {
    const { current: slateBlockRef } = this.slateBlockRef;
    if (slateBlockRef) {
      const sectionNode = getSectionElementInEditor(nodeEl);
      const rect = nodeEl.getBoundingClientRect();
      slateBlockRef.style.top = `${rect.top -
        sectionNode.getBoundingClientRect().top -
        14}px`;
      slateBlockRef.style.left = '-78px';
      slateBlockRef.style.position = 'absolute';
      slateBlockRef.style.opacity = 1;
      this.slateBlockButtonRef.current.setAttribute('aria-hidden', false);
      this.slateBlockButtonRef.current.tabIndex = 0;
      this.slateBlockButtonRef.current.disabled = false;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = 999;
      }, 100);
    }
  }

  focusInsideIllegalArea() {
    const { editor, illegalAreas } = this.props;
    let node = editor.value.document.getClosestBlock(
      editor.value.selection.start.key,
    );
    while (true) {
      const parent = editor.value.document.getParent(node.key);
      if (
        !parent ||
        parent.get('type') === 'section' ||
        parent.get('type') === 'document'
      ) {
        return false;
      }
      if (illegalAreas.includes(parent.get('type'))) {
        return true;
      }
      node = parent;
    }
  }

  showPicker() {
    const { editor, allowedPickAreas } = this.props;

    const node = editor.value.document.getClosestBlock(
      editor.value.selection.start.key,
    );

    const show =
      this.state.isOpen ||
      (node &&
        node.text.length === 0 &&
        !this.focusInsideIllegalArea() &&
        allowedPickAreas.includes(node.type) &&
        editor.value.selection.isFocused);

    if (show) {
      const nodeEl = findDOMNode(node); // eslint-disable-line react/no-find-dom-node
      this.update(nodeEl);
    } else {
      const { current: slateBlockRef } = this.slateBlockRef;
      slateBlockRef.style.opacity = 0;
      this.slateBlockButtonRef.current.setAttribute('aria-hidden', true);
      this.slateBlockButtonRef.current.tabIndex = -1;
      this.slateBlockButtonRef.current.disabled = true;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = 0;
      }, 100);
    }
  }

  getActionsForArea() {
    const { actionsToShowInAreas, editor } = this.props;
    let node = editor.value.document.getClosestBlock(
      editor.value.selection.start.key,
    );
    if (!node || !actionsToShowInAreas) {
      return actions;
    }
    while (true) {
      const parent = editor.value.document.getParent(node.key);
      if (
        !parent ||
        parent.get('type') === 'section' ||
        parent.get('type') === 'document'
      ) {
        return actions;
      }
      const parentType = parent.get('type');
      if (actionsToShowInAreas[parentType]) {
        return actions.filter(action =>
          actionsToShowInAreas[parentType].includes(action.data.object),
        );
      }
      node = parent;
    }
  }

  render() {
    const { t } = this.props;
    const { isOpen, visualElementSelect } = this.state;
    return (
      <>
        <Portal isOpened={visualElementSelect.isOpen}>
          <SlateVisualElementPicker
            resource={visualElementSelect.visualElementType}
            onVisualElementClose={this.onVisualElementClose}
            onInsertBlock={this.onInsertBlock}
          />
        </Portal>
        <div ref={this.slateBlockRef}>
          <SlateBlockMenu
            ref={this.slateBlockButtonRef}
            cy="slate-block-picker"
            isOpen={isOpen}
            heading={t('editorBlockpicker.heading')}
            actions={this.getActionsForArea().map(action => ({
              ...action,
              label: t(`editorBlockpicker.actions.${action.data.object}`),
            }))}
            onToggleOpen={this.toggleIsOpen}
            clickItem={data => {
              this.onElementAdd(data);
            }}
          />
        </div>
      </>
    );
  }
}

SlateBlockPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  addSection: PropTypes.func.isRequired,
  allowedPickAreas: PropTypes.arrayOf(PropTypes.string),
  illegalAreas: PropTypes.arrayOf(PropTypes.string),
  articleLanguage: PropTypes.string.isRequired,
  actionsToShowInAreas: PropTypes.shape({}), //dynamic keys...,
};

export default injectT(SlateBlockPicker);
