/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross, Document, Plus } from 'ndla-ui/icons';
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
    const { blocks, onChange, name } = this.props;
    switch (type) {
      case 'block': {
        const newblocks = [].concat(blocks);
        newblocks.push({ state: createEmptyState(), index: blocks.length });
        onChange({
          target: {
            name,
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

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { showTypePicker, index } = this.props;
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
          <Button
            stripped
            {...classes('block-type-button')}
            onClick={() => this.onElementAdd('block')}>
            <Document />
          </Button>
        </div>
      </div>
    );
  }
}

SlateBlockPicker.propTypes = {
  blocks: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  showTypePicker: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default SlateBlockPicker;
