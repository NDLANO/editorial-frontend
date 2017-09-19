/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { Plain, findDOMNode } from 'slate';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  H5P,
  Cross,
  Plus,
  Ingress,
  Paragraph,
  Camera,
  Video,
  Audio,
  FactBox,
  TextInBox,
} from 'ndla-ui/icons';
import { createEmptyState } from '../../../util/articleContentConverter';
import { defaultAsideBlock } from '../schema';
import { defaultBodyBoxBlock } from './bodybox';
import SlateEmbedPicker from './SlateEmbedPicker';

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
    this.focusInsideAside = this.focusInsideAside.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onEmbedClose = this.onEmbedClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.editorState.state.isFocused && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
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

  onInsertBlock(block) {
    const { blocks, editorState } = this.props;
    const newblocks = [].concat(blocks);
    const currentState = blocks[editorState.index];
    const nextState = currentState.state.transform().insertBlock(block).apply();

    newblocks[editorState.index] = {
      ...newblocks[editorState.index],
      state: nextState,
    };

    this.onStateChange('content', newblocks);
  }

  onElementAdd(type) {
    const { blocks, ingress, ingressRef } = this.props;
    switch (type.type) {
      case 'block': {
        const newblocks = [].concat(blocks);
        newblocks.push({ state: createEmptyState(), index: blocks.length });
        this.onStateChange('content', newblocks);
        break;
      }
      case 'ingress': {
        ingressRef.scrollIntoView();
        this.onStateChange(ingress.name, Plain.deserialize(''));
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
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

  update() {
    if (!this.menuEl) return;
    const { editorState } = this.props;
    const menuEl = this.menuEl;
    const bodyRect = document.body.getBoundingClientRect();
    const node = editorState.state.document.getClosestBlock(
      editorState.state.selection.startKey,
    );

    menuEl.style.position = 'absolute';
    const nodeEl = findDOMNode(node); // eslint-disable-line
    const rect = nodeEl.getBoundingClientRect();
    menuEl.style.top = `${rect.top - bodyRect.top - 5}px`;
    menuEl.style.left = `${rect.left - 60}px`;
  }

  focusInsideAside() {
    const { editorState } = this.props;
    let node = editorState.state.document.getClosestBlock(
      editorState.state.selection.startKey,
    );
    while (true) {
      const parent = editorState.state.document.getParent(node.key);
      if (
        parent.get('type') === 'section' ||
        parent.get('type') === 'document' ||
        !parent
      ) {
        return false;
      }
      if (parent.get('type') === 'aside' || parent.get('type') === 'bodybox')
        return true;
      node = parent;
    }
  }

  showPicker() {
    const { editorState } = this.props;
    const node = editorState.state.document.getClosestBlock(
      editorState.state.selection.startKey,
    );
    const show =
      node.text.length === 0 &&
      !this.focusInsideAside() &&
      allowedPickAreas.includes(node.type) &&
      editorState.state.isFocused;
    if (show) {
      this.update();
    }
    return show;
    // this.update();
    // return true;
  }

  render() {
    const { ingress, editorState, blocks } = this.props;
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <div>
        {this.state.embedSelect.isOpen
          ? <SlateEmbedPicker
              state={editorState}
              blocks={blocks}
              resource={this.state.embedSelect.embedType}
              isOpen={this.state.embedSelect.isOpen}
              onEmbedClose={this.onEmbedClose}
              onStateChange={this.onStateChange}
            />
          : ''}
        <div
          {...classes(
            'block-type-container',
            !this.showPicker() ? 'hidden' : '',
          )}
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
            {!ingress.value
              ? <Button
                  stripped
                  {...classes('block-type-button')}
                  onMouseDown={() => this.onElementAdd({ type: 'ingress' })}>
                  <Ingress />
                </Button>
              : ''}
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
                this.onElementAdd({ type: 'embed', kind: 'brightcove' })}>
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
      </div>
    );
  }
}

SlateBlockPicker.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
  ingressRef: PropTypes.shape({
    scrollIntoView: PropTypes.func.isRequired,
  }),
  editorState: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
  }),
};

export default SlateBlockPicker;
