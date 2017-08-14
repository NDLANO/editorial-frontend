/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { Plain } from 'slate';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross, Plus } from 'ndla-ui/icons';
import { createEmptyState } from '../../util/articleContentConverter';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateBlockPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onElementAdd = this.onElementAdd.bind(this);
  }

  onElementAdd(type) {
    const { blocks, onChange, ingress, ingressRef } = this.props;
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
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { showTypePicker, index, ingress } = this.props;
    if (!showTypePicker.show || index !== showTypePicker.index) {
      return null;
    }

    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
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
        </div>
      </div>
    );
  }
}

SlateBlockPicker.propTypes = {
  blocks: PropTypes.array.isRequired,
  showTypePicker: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
  ingressRef: PropTypes.shape({
    scrollIntoView: PropTypes.func.isRequired,
  }),
};

export default SlateBlockPicker;
