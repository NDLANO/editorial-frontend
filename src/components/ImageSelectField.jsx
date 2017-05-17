/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'ndla-ui';
import Lightbox from './Lightbox';
import ImageSearch from '../containers/ImageSearch/ImageSearch';
import DisplayEmbedTag from './DisplayEmbedTag';
import * as actions from '../containers/ImageSearch/imageActions';


class ImageSelectField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {
      searchImages,
      name,
      bindInput,
    } = this.props;

    const { onChange, value } = bindInput(name);

    const onImageLightboxClose = () => {
      this.setState({ isOpen: false });
    };
    const onImageLightboxOpen = () => {
      searchImages();
      this.setState({ isOpen: true });
    };
    console.log(value);

    return (
      <div>
        <DisplayEmbedTag embedTag={value} />
        <Button onClick={onImageLightboxOpen}>Legg til visuelt element</Button>
        <div className="big-lightbox_wrapper big-lightbox_wrapper--scroll">
          <Lightbox display={this.state.isOpen} big onClose={onImageLightboxClose}>
            <h2>Bildesøk</h2>
            <ImageSearch onChange={onChange} />
          </Lightbox>
        </div>
      </div>
    );
  }
}

ImageSelectField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  searchImages: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  searchImages: actions.searchImages,
};

export default connect(state => state, mapDispatchToProps)(ImageSelectField);
