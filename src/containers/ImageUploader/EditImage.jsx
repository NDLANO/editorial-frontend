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
    fetchImage({ id, language: imageLanguage });
  }
  componentWillReceiveProps(nextProps) {
    const { imageId: id, fetchImage, imageLanguage, image } = nextProps;

    if (
      (image && image.language !== imageLanguage) ||
      id !== this.props.imageId
    ) {
      fetchImage({ id, language: imageLanguage });
    }
  }
  render() {
    const {
      locale,
      tags,
      licenses,
      isSaving,
      history,
      image: imageData,
      updateImage,
    } = this.props;

    if (!imageData) {
      return null;
    }

    return (
      <ImageForm
        initialModel={getInitialModel(imageData)}
        revision={imageData.revision}
        imageInfo={imageData.imageFile}
        tags={tags}
        licenses={licenses}
        locale={locale}
        onUpdate={(image, file) => updateImage({ image, file, history })}
        isSaving={isSaving}
      />
    );
  }
}

EditImage.propTypes = {
  imageId: PropTypes.string.isRequired,
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
  imageLanguage: PropTypes.string.isRequired,
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
  connect(mapStateToProps, mapDispatchToProps)(EditImage),
);
