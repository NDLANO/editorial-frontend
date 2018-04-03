/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { findDOMNode } from 'slate-react';
import Types from 'slate-prop-types';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  H5P,
  Paragraph,
  Camera,
  Video,
  FactBox,
  TextInBox,
  Table,
  ExpandableBox,
  RelatedArticle,
} from 'ndla-icons/editor';
import { Cross, Plus } from 'ndla-icons/action';
import { Audio } from 'ndla-icons/common';

import { Portal } from '../../../../components/Portal';
import { defaultAsideBlock } from '../../schema';
import { defaultBodyBoxBlock } from './../bodybox';
import { defaultDetailsBlock } from './../detailsbox';
import SlateEmbedPicker from './SlateEmbedPicker';
import { editTablePlugin } from './../externalPlugins';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const actions = [
  { data: { type: 'block', object: 'block' }, icon: <Paragraph /> },
  { data: { type: 'aside', object: 'factAside' }, icon: <FactBox /> },
  { data: { type: 'table', object: 'table' }, icon: <Table /> },
  { data: { type: 'bodybox', object: 'bodybox' }, icon: <TextInBox /> },
  { data: { type: 'details', object: 'details' }, icon: <ExpandableBox /> },
  { data: { type: 'embed', object: 'image' }, icon: <Camera /> },
  { data: { type: 'embed', object: 'video' }, icon: <Video /> },
  { data: { type: 'embed', object: 'audio' }, icon: <Audio /> },
  { data: { type: 'embed', object: 'h5p' }, icon: <H5P /> },
  {
    data: { type: 'embed', object: 'related-content' },
    icon: <RelatedArticle />,
  },
];

class SlateBlockPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      embedSelect: {
        isOpen: false,
      },
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onElementAdd = this.onElementAdd.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.focusInsideIllegalArea = this.focusInsideIllegalArea.bind(this);
    this.onEmbedClose = this.onEmbedClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.editorValue.isFocused && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  componentDidUpdate() {
    this.showPicker();
  }

  onEmbedClose() {
    this.setState({ embedSelect: { isOpen: false, embedType: '' } });
  }

  onInsertBlock(block) {
    const { editorValue, onChange } = this.props;
    const nextChange = editorValue.change().insertBlock(block);
    onChange(nextChange);
  }

  onElementAdd(block) {
    const { editorValue, onChange, addSection } = this.props;
    switch (block.type) {
      case 'block': {
        addSection();
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
        break;
      }
      case 'details': {
        this.onInsertBlock(defaultDetailsBlock());
        break;
      }
      case 'table': {
        const change = editorValue.change();
        onChange(editTablePlugin.changes.insertTable(change, 2, 2));
        break;
      }
      case 'aside': {
        this.onInsertBlock(defaultAsideBlock(block.object));
        break;
      }
      case 'embed': {
        this.setState({
          embedSelect: { isOpen: true, embedType: block.object },
        });
        break;
      }
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  toggleIsOpen(evt) {
    evt.preventDefault();
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  update(nodeEl) {
    const { menuEl } = this;
    if (!menuEl) return;
    const bodyRect = document.body.getBoundingClientRect();
    menuEl.style.position = 'absolute';
    const rect = nodeEl.getBoundingClientRect();
    menuEl.style.top = `${rect.top - bodyRect.top - 5}px`;
    menuEl.style.left = `${rect.left - 60}px`;
  }

  focusInsideIllegalArea() {
    const { editorValue, illegalAreas } = this.props;
    let node = editorValue.document.getClosestBlock(
      editorValue.selection.startKey,
    );
    while (true) {
      const parent = editorValue.document.getParent(node.key);
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
    const hiddenClassName = classes(
      'block-type-container',
      'hidden',
    ).className.split(' ')[1];

    const { editorValue, allowedPickAreas } = this.props;
    if (!editorValue.selection.startKey) {
      this.menuEl.classList.add(hiddenClassName);
      return;
    }

    const node = editorValue.document.getClosestBlock(
      editorValue.selection.startKey,
    );
    const nodeEl = findDOMNode(node); // eslint-disable-line react/no-find-dom-node

    const show =
      node.text.length === 0 &&
      !this.focusInsideIllegalArea() &&
      allowedPickAreas.includes(node.type) &&
      editorValue.isFocused;

    if (show) {
      this.menuEl.classList.remove(hiddenClassName);
      this.update(nodeEl);
    } else {
      this.menuEl.classList.add(hiddenClassName);
    }
  }

  render() {
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <Portal isOpened>
        {this.state.embedSelect.isOpen ? (
          <SlateEmbedPicker
            resource={this.state.embedSelect.embedType}
            isOpen={this.state.embedSelect.isOpen}
            onEmbedClose={this.onEmbedClose}
            onInsertBlock={this.onInsertBlock}
          />
        ) : (
          ''
        )}
        <div
          {...classes('block-type-container', 'hidden')}
          ref={menuEl => {
            this.menuEl = menuEl;
          }}>
          <Button
            stripped
            {...classes('block-type-button')}
            onMouseDown={this.toggleIsOpen}>
            {this.state.isOpen ? (
              <Cross className="c-icon--medium" />
            ) : (
              <Plus className="c-icon--medium" />
            )}
          </Button>
          <div {...classes('block-type', typeClassName)}>
            {actions.map(action => (
              <Button
                key={action.data.object}
                stripped
                {...classes('block-type-button')}
                onMouseDown={() => this.onElementAdd(action.data)}>
                {action.icon}
              </Button>
            ))}
          </div>
        </div>
      </Portal>
    );
  }
}

SlateBlockPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorValue: Types.value.isRequired,
  addSection: PropTypes.func.isRequired,
  allowedPickAreas: PropTypes.arrayOf(PropTypes.string),
  illegalAreas: PropTypes.arrayOf(PropTypes.string),
};

export default SlateBlockPicker;
