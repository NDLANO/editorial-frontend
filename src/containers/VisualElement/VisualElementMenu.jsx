/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import { Cross, Plus } from '@ndla/icons/action';
import { H5P, Camera, Video } from '@ndla/icons/editor';
import { visualElementClasses } from '../TopicArticlePage/components/TopicArticleVisualElement';

const visualElementButtonStyle = css`
  height: 40px;
  width: 40px;
  border: 1px solid ${colors.brand.grey};
  border-radius: 25px;
  margin-right: 0.3rem;
  color: ${colors.brand.grey};

  &:focus,
  &:hover {
    color: ${colors.brand.grey};
    border: 1px solid ${colors.brand.grey};
    border-radius: 25px;
  }
`;

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
          css={visualElementButtonStyle}
          onClick={this.toggleIsOpen}>
          {this.state.isOpen ? <Cross /> : <Plus />}
        </Button>
        <div {...visualElementClasses('type', typeClassName)}>
          <Button
            stripped
            css={visualElementButtonStyle}
            onClick={() => this.handleSelect('image')}>
            <Camera />
          </Button>
          <Button
            stripped
            css={visualElementButtonStyle}
            onClick={() => this.handleSelect('video')}>
            <Video />
          </Button>
          <Button
            stripped
            css={visualElementButtonStyle}
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
