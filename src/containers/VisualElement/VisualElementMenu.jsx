/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Cross, H5P, Camera, Plus, Video } from 'ndla-ui/icons';
import { classes } from '../../components/Fields';

class VisualElementMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(type) {
    const { onSelect } = this.props;
    this.setState({ isOpen: false });
    onSelect(type);
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const typeClassName = this.state.isOpen ? '' : 'hidden';
    return (
      <div>
        <Button
          stripped
          {...classes('visual-element-type-button')}
          onClick={this.toggleIsOpen}>
          {this.state.isOpen ? <Cross /> : <Plus />}
        </Button>
        <div {...classes('visual-element-type', typeClassName)}>
          <Button
            stripped
            {...classes('visual-element-type-button')}
            onClick={() => this.handleSelect('image')}>
            <Camera />
          </Button>
          <Button
            stripped
            {...classes('visual-element-type-button')}
            onClick={() => this.handleSelect('brightcove')}>
            <Video />
          </Button>
          <Button
            stripped
            {...classes('visual-element-type-button')}
            onClick={() => this.handleSelect('h5p')}>
            <H5P />
          </Button>
        </div>
      </div>
    );
  }
}

VisualElementMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default VisualElementMenu;
