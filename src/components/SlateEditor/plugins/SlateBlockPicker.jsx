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
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeEditor.hasFocus && this.state.isOpen) {
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

  onElementAdd(type) {
    const { blocks, ingress, ingressRef, state } = this.props;
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
      case 'aside': {
        const newblocks = [].concat(blocks);
        const currentState = blocks[state.index];
        const nextState = currentState.state
          .transform()
          .insertBlock(defaultAsideBlock(type.kind))
          .apply();

        newblocks[state.index] = {
          ...newblocks[state.index],
          state: nextState,
        };

        this.onStateChange('content', newblocks);
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
    const { setFocus, activeEditor } = this.props;
    setFocus(activeEditor.index);
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  update() {
    if (!this.menuEl) return;
    const { state } = this.props;
    const menuEl = this.menuEl;
    const bodyRect = document.body.getBoundingClientRect();
    const node = state.state.document.getClosestBlock(
      state.state.selection.startKey,
    );
    menuEl.style.position = 'absolute';
    menuEl.style.zIndex = '1000';
    const nodeEl = findDOMNode(node); // eslint-disable-line
    const rect = nodeEl.getBoundingClientRect();
    menuEl.style.top = `${rect.top - bodyRect.top - 5}px`;
    menuEl.style.left = `${rect.left - bodyRect.left - 100}px`;
  }

  focusInsideAside() {
    const { state } = this.props;
    let node = state.state.document.getClosestBlock(
      state.state.selection.startKey,
    );
    while (true) {
      const parent = state.state.document.getParent(node.key);
      if (
        parent.get('type') === 'section' ||
        parent.get('type') === 'document' ||
        !parent
      ) {
        return false;
      }
      if (parent.get('type') === 'aside') return true;
      node = parent;
    }
  }

  showPicker() {
    const { state, activeEditor } = this.props;
    const node = state.state.document.getClosestBlock(
      state.state.selection.startKey,
    );
    const show =
      node.text.length === 0 &&
      !this.focusInsideAside() &&
      allowedPickAreas.includes(node.type) &&
      state.index === activeEditor.index &&
      activeEditor.hasFocus;
    if (show) {
      this.update();
    }
    return show;
  }

  render() {
    const { ingress, state, blocks } = this.props;
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <div>
        {this.state.embedSelect.isOpen
          ? <SlateEmbedPicker
              state={state}
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
                  onClick={() => this.onElementAdd({ type: 'ingress' })}>
                  <Ingress />
                </Button>
              : ''}
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() => this.onElementAdd({ type: 'block' })}>
              <Paragraph />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() =>
                this.onElementAdd({ type: 'aside', kind: 'factAside' })}>
              <FactBox />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() =>
                this.onElementAdd({ type: 'aside', kind: 'textAside' })}>
              <TextInBox />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() =>
                this.onElementAdd({ type: 'embed', kind: 'image' })}>
              <Camera />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() =>
                this.onElementAdd({ type: 'embed', kind: 'brightcove' })}>
              <Video />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() =>
                this.onElementAdd({ type: 'embed', kind: 'audio' })}>
              <Audio />
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() => this.onElementAdd({ type: 'embed', kind: 'h5p' })}>
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
  activeEditor: PropTypes.shape({
    index: PropTypes.number.isRequired,
    hasFocus: PropTypes.bool.isRequired,
  }),
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
  ingressRef: PropTypes.shape({
    scrollIntoView: PropTypes.func.isRequired,
  }),
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
  }),
  setFocus: PropTypes.func.isRequired,
};

export default SlateBlockPicker;
