/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { Plain, Block, findDOMNode } from 'slate';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross, Plus, InsertTemplate } from 'ndla-ui/icons';
import { createEmptyState } from '../../../util/articleContentConverter';
import { defaultBlock } from '../schema';

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
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onElementAdd = this.onElementAdd.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.update = this.update.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.focusInsideAside = this.focusInsideAside.bind(this);
  }

  onElementAdd(type) {
    const { blocks, onChange, ingress, ingressRef, state } = this.props;
    switch (type) {
      case 'block': {
        const newblocks = [].concat(blocks);
        newblocks.push({ state: createEmptyState(), index: blocks.length });
        onChange({
          target: {
            name: 'content',
            value: newblocks,
          },
        });
        break;
      }
      case 'ingress': {
        ingressRef.scrollIntoView();
        onChange({
          target: {
            name: ingress.name,
            value: Plain.deserialize(''),
          },
        });
        break;
      }
      case 'factAside': {
        const newblocks = [].concat(blocks);
        const currentState = blocks[state.index];
        const factAsideBlock = Block.create({
          data: { type: 'factAside' },
          isVoid: false,
          type: 'aside',
          nodes: Block.createList([defaultBlock]),
        });
        const nextState = currentState.state
          .transform()
          .insertBlock(factAsideBlock)
          .apply();

        newblocks[state.index] = {
          ...newblocks[state.index],
          state: nextState,
        };
        onChange({
          target: {
            name: 'content',
            value: newblocks,
          },
        });
        break;
      }
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  onOpen(portal) {
    this.portal = portal;
    this.update();
  }

  onUpdate() {
    this.update();
  }

  onClose() {
    this.portal = null;
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  update() {
    if (!this.portal) return;
    const { state } = this.props;
    const menuEl = this.portal.firstChild;
    if (menuEl) {
      const bodyRect = document.body.getBoundingClientRect();
      const node = state.state.document.getClosestBlock(
        state.state.selection.startKey,
      );
      menuEl.style.position = 'absolute';
      const nodeEl = findDOMNode(node); // eslint-disable-line
      const rect = nodeEl.getBoundingClientRect();
      menuEl.style.top = `${rect.top - bodyRect.top - 5}px`;
      menuEl.style.left = `${rect.left - bodyRect.left - 100}px`;
    }
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

    return (
      node.text.length === 0 &&
      !this.focusInsideAside() &&
      allowedPickAreas.includes(node.type) &&
      state.index === activeEditor
    );
  }

  render() {
    const { ingress } = this.props;
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <Portal
        {...this.props}
        isOpened={this.showPicker()}
        onOpen={this.onOpen}
        onUpdate={this.onUpdate}>
        <div {...classes('block-type-container')}>
          <Button
            stripped
            {...classes('block-type-button')}
            onClick={this.toggleIsOpen}>
            {this.state.isOpen ? <Cross /> : <Plus />}
          </Button>
          <div {...classes('block-type', typeClassName)}>
            {!ingress.value
              ? <Button
                  stripped
                  {...classes('block-type-button', 'green')}
                  onClick={() => this.onElementAdd('ingress')}>
                  In.
                </Button>
              : ''}
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() => this.onElementAdd('block')}>
              ...
            </Button>
            <Button
              stripped
              {...classes('block-type-button')}
              onClick={() => this.onElementAdd('factAside')}>
              <InsertTemplate />
            </Button>
          </div>
        </div>
      </Portal>
    );
  }
}

SlateBlockPicker.propTypes = {
  blocks: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  activeEditor: PropTypes.number.isRequired,
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
};

export default SlateBlockPicker;
