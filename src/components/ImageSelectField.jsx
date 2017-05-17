/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'ndla-ui';
import Lightbox from './Lightbox';
import ImageSearch from '../containers/ImageSearch/ImageSearch';
import DisplayEmbedTag from './DisplayEmbedTag';
import * as actions from '../containers/ImageSearch/imageActions';

class ImageSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onImageLightboxOpen = this.onImageLightboxOpen.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }

  onImageLightboxOpen() {
    this.props.searchImages();
    this.setState(() => ({ isOpen: true }));
  }

  onImageLightboxClose() {
    this.setState(() => ({ isOpen: false }));
  }

  handleImageChange(image) {
    const { name, onChange } = this.props;
    onChange(
      { target: {
        name,
        value: `<embed data-size="fullbredde" data-align="" data-alt="" data-caption="" data-resource="image" data-resource_id="${image.id}" />`,
      } },
    );
    this.setState(() => ({ isOpen: false }));
  }

  render() {
    const {
      value,
    } = this.props;

    return (
      <div>
        { value ?
          <Button stripped onClick={this.onImageLightboxOpen}>
            <DisplayEmbedTag embedTag={value} />
          </Button>
          :
          <Button onClick={this.onImageLightboxOpen}>Legg til visuelt element</Button>
        }
        <Lightbox display={this.state.isOpen} big onClose={this.onImageLightboxClose}>
          <h2>Bildesøk</h2>
          <ImageSearch onChange={this.handleImageChange} />
        </Lightbox>
      </div>
    );
  }
}

ImageSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  searchImages: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  searchImages: actions.searchImages,
};

export default connect(state => state, mapDispatchToProps)(ImageSelectField);
