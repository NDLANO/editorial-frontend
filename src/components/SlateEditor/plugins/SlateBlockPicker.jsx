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
import { createEmptyValue } from '../../../util/articleContentConverter';
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
    this.onValueChange = this.onValueChange.bind(this);
    this.onEmbedClose = this.onEmbedClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.onBlocksChange = this.onBlocksChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.editorValue.value.isFocused && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  componentDidUpdate() {
    this.showPicker();
  }

  onValueChange(name, value) {
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
    const { blocks, editorValue } = this.props;
    const newblocks = [].concat(blocks);
    newblocks[editorValue.index] = {
      ...newblocks[editorValue.index],
      value: change.value,
    };

    this.onValueChange('content', newblocks);
  }

  onInsertBlock(block) {
    const { blocks, editorValue } = this.props;
    const currentValue = blocks[editorValue.index];
    const nextChange = currentValue.value.change().insertBlock(block);
    this.onBlocksChange(nextChange);
  }

  onElementAdd(type) {
    const { blocks, editorValue } = this.props;
    switch (type.type) {
      case 'block': {
        const newblocks = [].concat(blocks);
        newblocks.push({ value: createEmptyValue(), index: blocks.length });
        this.onValueChange('content', newblocks);
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
        break;
      }
      case 'table': {
        const change = blocks[editorValue.index].value.change();
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
    const { editorValue } = this.props;
    let node = editorValue.value.document.getClosestBlock(
      editorValue.value.selection.startKey,
    );
    while (true) {
      const parent = editorValue.value.document.getParent(node.key);
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

    const { editorValue } = this.props;

    if (!editorValue.value.selection.startKey) {
      this.menuEl.classList.add(hiddenClassName);
      return;
    }

    const node = editorValue.value.document.getClosestBlock(
      editorValue.value.selection.startKey,
    );

    const nodeEl = findDOMNode(node); // eslint-disable-line

    const show =
      node.text.length === 0 &&
      !this.focusInsideIllegalArea() &&
      allowedPickAreas.includes(node.type) &&
      editorValue.value.isFocused;

    if (show) {
      this.menuEl.classList.remove(hiddenClassName);
      this.update(nodeEl);
    } else {
      this.menuEl.classList.add(hiddenClassName);
    }
  }

  render() {
    const { editorValue, blocks } = this.props;
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <Portal isOpened>
        {this.state.embedSelect.isOpen ? (
          <SlateEmbedPicker
            value={editorValue}
            blocks={blocks}
            resource={this.state.embedSelect.embedType}
            isOpen={this.state.embedSelect.isOpen}
            onEmbedClose={this.onEmbedClose}
            onValueChange={this.onValueChange}
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
                this.onElementAdd({ type: 'aside', kind: 'factAside' })
              }>
              <FactBox />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'table', kind: 'table' })
              }>
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
                this.onElementAdd({ type: 'embed', kind: 'image' })
              }>
              <Camera />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'video' })
              }>
              <Video />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'audio' })
              }>
              <Audio />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onMouseDown={() =>
                this.onElementAdd({ type: 'embed', kind: 'h5p' })
              }>
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
      value: Types.value.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  editorValue: PropTypes.shape({
    index: PropTypes.number.isRequired,
    value: PropTypes.object.isRequired,
  }),
};

export default SlateBlockPicker;
