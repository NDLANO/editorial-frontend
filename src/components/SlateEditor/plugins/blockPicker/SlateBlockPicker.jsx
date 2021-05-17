/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { SlateBlockMenu } from '@ndla/editor';
import { Portal } from '../../../Portal';
import { defaultBlocks, checkSelectionForType } from '../../utils';
// import { defaultBodyBoxBlock } from '../bodybox';
// import { defaultDetailsBlock } from '../details';
import SlateVisualElementPicker from './SlateVisualElementPicker';
import actions from './actions';
import { Editor, Element, Node } from 'slate';
import { ReactEditor } from 'slate-react';

const { defaultAsideBlock, defaultRelatedBlock, defaultCodeBlock } = defaultBlocks;

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
    this.onVisualElementClose = this.onVisualElementClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.getActionsForArea = this.getActionsForArea.bind(this);
    this.slateBlockRef = React.createRef();
    this.slateBlockButtonRef = React.createRef();
    this.zIndexTimeout = null;
  }

  componentDidMount() {
    this.slateBlockRef.current.style.transition = 'opacity 200ms ease';
    this.slateBlockRef.current.style.position = 'absolute';
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
    editor
      .insertBlock(block)
      .focus()
      .moveForward(1);
  }

  onElementAdd(block) {
    const { editor } = this.props;
    switch (block.type) {
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
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
      case 'code-block': {
        this.onInsertBlock(defaultCodeBlock());
        break;
      }
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  toggleIsOpen(open) {
    this.setState({ isOpen: open });
  }

  async update() {
    const { current: slateBlockRef } = this.slateBlockRef;
    const { editor } = this.props;
    if (slateBlockRef && ReactEditor.isFocused(editor)) {
      await new Promise(resolve => setTimeout(resolve, 50));

      // Find location of text selection to calculate where to move slateBlock
      const range = ReactEditor.toDOMRange(editor, editor.selection);
      const rect = range.getBoundingClientRect();

      slateBlockRef.style.top = `${rect.top + window.scrollY - 14}px`;
      slateBlockRef.style.left = `${rect.left + window.scrollX - 78 - rect.width / 2}px`;
      slateBlockRef.style.position = 'absolute';
      slateBlockRef.style.opacity = 1;

      this.slateBlockButtonRef.current.setAttribute('aria-hidden', false);
      this.slateBlockButtonRef.current.tabIndex = 0;
      this.slateBlockButtonRef.current.disabled = false;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = 1;
      }, 100);
    }
  }

  shouldShowMenuPicker = () => {
    const { editor, illegalAreas, allowedPickAreas } = this.props;

    const [node] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && !editor.isInline(node),
      mode: 'lowest',
    });

    const [illegalBlock] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && illegalAreas.includes(node.type),
    });

    return (
      this.state.isOpen ||
      (node &&
        Node.string(node[0]).length === 0 &&
        !illegalBlock &&
        allowedPickAreas.includes(node[0].type) &&
        ReactEditor.isFocused(editor))
    );
  };

  showPicker() {
    if (this.shouldShowMenuPicker()) {
      this.update();
    } else {
      const { current: slateBlockRef } = this.slateBlockRef;
      slateBlockRef.style.opacity = 0;
      this.slateBlockButtonRef.current.setAttribute('aria-hidden', true);
      this.slateBlockButtonRef.current.tabIndex = -1;
      this.slateBlockButtonRef.current.disabled = true;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = -1;
      }, 100);
    }
  }

  getActionsForArea() {
    const { actionsToShowInAreas, editor } = this.props;
    return actions;
    // let node = editor.value.document.getClosestBlock(editor.value.selection.start.key);
    // if (!node || !actionsToShowInAreas) {
    //   return actions;
    // }
    // while (true) {
    //   const parent = editor.value.document.getParent(node.key);
    //   if (!parent || parent.get('type') === 'section' || parent.get('type') === 'document') {
    //     return actions;
    //   }
    //   const parentType = parent.get('type');
    //   if (actionsToShowInAreas[parentType]) {
    //     return actions.filter(action =>
    //       actionsToShowInAreas[parentType].includes(action.data.type),
    //     );
    //   }
    //   node = parent;
    // }
  }

  render() {
    const { t, articleLanguage } = this.props;
    const { isOpen, visualElementSelect } = this.state;
    return (
      <>
        <Portal isOpened={visualElementSelect.isOpen}>
          <SlateVisualElementPicker
            articleLanguage={articleLanguage}
            resource={visualElementSelect.visualElementType}
            onVisualElementClose={this.onVisualElementClose}
            onInsertBlock={this.onInsertBlock}
          />
        </Portal>
        <Portal isOpened>
          <div cy="slate-block-picker-button" ref={this.slateBlockRef}>
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
        </Portal>
      </>
    );
  }
}

SlateBlockPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  allowedPickAreas: PropTypes.arrayOf(PropTypes.string),
  illegalAreas: PropTypes.arrayOf(PropTypes.string),
  articleLanguage: PropTypes.string.isRequired,
  actionsToShowInAreas: PropTypes.shape({}), //dynamic keys...,
};

export default injectT(SlateBlockPicker);
