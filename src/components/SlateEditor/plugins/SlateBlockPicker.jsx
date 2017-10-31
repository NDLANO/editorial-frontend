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
  Cross,
  Plus,
  Paragraph,
  Camera,
  Video,
  Audio,
  FactBox,
  TextInBox,
  Table,
} from 'ndla-ui/icons';
import { Portal } from '../../../components/Portal';
import { createEmptyState } from '../../../util/articleContentConverter';
import { defaultAsideBlock } from '../schema';
import { defaultBodyBoxBlock } from './bodybox';
import SlateEmbedPicker from './SlateEmbedPicker';
import { editTablePlugin } from './externalPlugins';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const allowedPickAreas = [
  'paragraph',
  'heading-one',
  'heading-two',
  'heading-three',
];

const illegalAreas = [
  'quote',
  'list-item',
  'numbered-list',
  'aside',
  'bodybox',
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
    this.onStateChange = this.onStateChange.bind(this);
    this.onEmbedClose = this.onEmbedClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.onBlocksChange = this.onBlocksChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.editorState.state.isFocused && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  componentDidUpdate() {
    this.showPicker();
  }

  onStateChange(name, value) {
    const { onChange } = this.props;
    onChange({
      target: {
        name,
        value,
      },
    });
  }

  onEmbedClose() {
    this.setState({ embedSelect: { isOpen: false, embedType: '' } });
  }

  onBlocksChange(change) {
    const { blocks, editorState } = this.props;
    const newblocks = [].concat(blocks);
    newblocks[editorState.index] = {
      ...newblocks[editorState.index],
      state: change.state,
    };

    this.onStateChange('content', newblocks);
  }

  onInsertBlock(block) {
    const { blocks, editorState } = this.props;
    const currentState = blocks[editorState.index];
    const nextChange = currentState.state.change().insertBlock(block);
    this.onBlocksChange(nextChange);
  }

  onElementAdd(type) {
    const { blocks, editorState } = this.props;
    switch (type.type) {
      case 'block': {
        const newblocks = [].concat(blocks);
        newblocks.push({ state: createEmptyState(), index: blocks.length });
        this.onStateChange('content', newblocks);
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
        break;
      }
      case 'table': {
        const change = blocks[editorState.index].state.change();
        this.onBlocksChange(editTablePlugin.changes.insertTable(change, 2, 2));
        break;
      }
      case 'aside': {
        this.onInsertBlock(defaultAsideBlock(type.kind));
        break;
      }
      case 'embed': {
        this.setState({ embedSelect: { isOpen: true, embedType: type.kind } });
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
    if (!this.menuEl) return;
    const menuEl = this.menuEl;
    const bodyRect = document.body.getBoundingClientRect();
    menuEl.style.position = 'absolute';
    const rect = nodeEl.getBoundingClientRect();
    menuEl.style.top = `${rect.top - bodyRect.top - 5}px`;
    menuEl.style.left = `${rect.left - 60}px`;
  }

  focusInsideIllegalArea() {
    const { editorState } = this.props;
    let node = editorState.state.document.getClosestBlock(
      editorState.state.selection.startKey,
    );
    while (true) {
      const parent = editorState.state.document.getParent(node.key);
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

    const { editorState } = this.props;

    if (!editorState.state.selection.startKey) {
      this.menuEl.classList.add(hiddenClassName);
      return;
    }

    const node = editorState.state.document.getClosestBlock(
      editorState.state.selection.startKey,
    );

    const nodeEl = findDOMNode(node); // eslint-disable-line

    const show =
      node.text.length === 0 &&
      !this.focusInsideIllegalArea() &&
      allowedPickAreas.includes(node.type) &&
      editorState.state.isFocused;

    if (show) {
      this.menuEl.classList.remove(hiddenClassName);
      this.update(nodeEl);
    } else {
      this.menuEl.classList.add(hiddenClassName);
    }
  }

  render() {
    const { editorState, blocks } = this.props;
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <Portal isOpened>
        {this.state.embedSelect.isOpen ? (
          <SlateEmbedPicker
            state={editorState}
            blocks={blocks}
            resource={this.state.embedSelect.embedType}
            isOpen={this.state.embedSelect.isOpen}
            onEmbedClose={this.onEmbedClose}
            onStateChange={this.onStateChange}
          />
        ) : (
          ''
        )}
        <div
          {...classes('block-type-container')}
          ref={menuEl => {
            this.menuEl = menuEl;
          }}>
          <Button
            stripped
            {...classes('block-type-button')}
            onMouseDown={this.toggleIsOpen}>
            {this.state.isOpen ? <Cross /> : <Plus />}
          </Button>
          <div {...classes('block-type', typeClassName)}>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() => this.onElementAdd({ type: 'block' })}>
              <Paragraph />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'aside', kind: 'factAside' })}>
              <FactBox />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'table', kind: 'table' })}>
              <Table />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() => this.onElementAdd({ type: 'bodybox' })}>
              <TextInBox />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'image' })}>
              <Camera />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'video' })}>
              <Video />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'audio' })}>
              <Audio />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'h5p' })}>
              <H5P />
            </Button>
          </div>
        </div>
      </Portal>
    );
  }
}

SlateBlockPicker.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      state: Types.state.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
  }),
};

export default SlateBlockPicker;
