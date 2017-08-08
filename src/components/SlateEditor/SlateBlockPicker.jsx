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
import { Cross, Camera, Plus, Video } from 'ndla-ui/icons';

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
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  onTypeChange(type) {
    /* onChange({
      target: {
        name,
        value: type,
      },
    });*/
    this.setState({ isOpen: false });
    // toggleShowVisualElement();
  }

  toggleIsOpen() {
    console.log('YO');
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <div>
        <Button
          stripped
          {...classes('editor-block-type-button')}
          onClick={this.toggleIsOpen}>
          {this.state.isOpen ? <Cross /> : <Plus />}
        </Button>
        <div {...classes('editor-block-type', typeClassName)}>
          <Button
            stripped
            {...classes('editor-block-type-button')}
            onClick={() => this.onTypeChange('image')}>
            <Camera />
          </Button>
        </div>
      </div>
    );
  }
}

SlateBlockPicker.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default SlateBlockPicker;
