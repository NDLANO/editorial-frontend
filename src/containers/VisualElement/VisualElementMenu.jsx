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
import { Cross, Plus } from 'ndla-icons/action';
import { H5P, Camera, Video } from 'ndla-icons/editor';
import { visualElementClasses } from '../TopicArticlePage/components/TopicArticleVisualElement';

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
          {...visualElementClasses('type-button')}
          onClick={this.toggleIsOpen}>
          {this.state.isOpen ? <Cross /> : <Plus />}
        </Button>
        <div {...visualElementClasses('type', typeClassName)}>
          <Button
            stripped
            {...visualElementClasses('type-button')}
            onClick={() => this.handleSelect('image')}>
            <Camera />
          </Button>
          <Button
            stripped
            {...visualElementClasses('type-button')}
            onClick={() => this.handleSelect('video')}>
            <Video />
          </Button>
          <Button
            stripped
            {...visualElementClasses('type-button')}
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
