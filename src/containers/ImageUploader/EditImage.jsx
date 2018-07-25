/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ImageForm, { getInitialModel } from './components/ImageForm';
import { actions, getImage } from '../../modules/image/image';
import { ImageShape } from '../../shapes';

class EditImage extends Component {
  componentWillMount() {
    const { imageId: id, fetchImage, imageLanguage } = this.props;
    if (id) fetchImage({ id, language: imageLanguage });
  }
  componentWillReceiveProps(nextProps) {
    const { imageId: id, fetchImage, imageLanguage, image } = nextProps;

    if (
      id &&
      imageLanguage &&
      ((image && image.language !== imageLanguage) || id !== this.props.imageId)
    ) {
      fetchImage({ id, language: imageLanguage });
    }
  }
  render() {
    const {
      history,
      image: imageData,
      updateImage,
      locale,
      ...rest
    } = this.props;

    return (
      <ImageForm
        initialModel={getInitialModel(imageData || { language: locale })}
        revision={imageData && imageData.revision}
        imageInfo={imageData && imageData.imageFile}
        onUpdate={(image, file) => updateImage({ image, file, history })}
        {...rest}
      />
    );
  }
}

EditImage.propTypes = {
  imageId: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchImage: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  image: ImageShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  updateImage: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  imageLanguage: PropTypes.string,
};

const mapDispatchToProps = {
  fetchImage: actions.fetchImage,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state, props) => {
  const { imageId } = props;
  const getImageSelector = getImage(imageId, true);
  return {
    image: getImageSelector(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditImage),
);
