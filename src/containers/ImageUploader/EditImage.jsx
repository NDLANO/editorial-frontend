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

import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getLocale } from '../../modules/locale/locale';
import ImageForm from './components/ImageForm';
import { actions, getImage } from '../../modules/image/image';
import { ImageShape } from '../../shapes';

class EditImage extends Component {
  componentDidMount() {
    const {
      imageId,
      fetchImage,
      imageLanguage,
      fetchTags,
      fetchLicenses,
      locale,
    } = this.props;
    if (imageId) {
      fetchImage({ id: imageId, language: imageLanguage });
    }
    fetchTags({ language: locale });
    fetchLicenses();
  }

  componentDidUpdate({ imageId: prevImageId }) {
    const { imageId, fetchImage, imageLanguage, image } = this.props;

    if (
      imageId &&
      imageLanguage &&
      ((image && image.language !== imageLanguage) || imageId !== prevImageId)
    ) {
      fetchImage({ id: imageId, language: imageLanguage });
    }
  }

  render() {
    const {
      history,
      image: imageData,
      updateImage,
      locale,
      editingArticle,
      closeModal,
      isNewlyCreated,
      ...rest
    } = this.props;

    return (
      <ImageForm
        image={imageData || { language: locale }}
        revision={imageData && imageData.revision}
        imageInfo={imageData && imageData.imageFile}
        onUpdate={(image, file) => {
          updateImage({ image, file, history, editingArticle });
        }}
        closeModal={closeModal}
        isNewlyCreated={isNewlyCreated}
        {...rest}
      />
    );
  }
}

EditImage.propTypes = {
  imageId: PropTypes.string,
  fetchTags: PropTypes.func.isRequired,
  fetchLicenses: PropTypes.func.isRequired,
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
  inModal: PropTypes.bool,
  closeModal: PropTypes.func,
  editingArticle: PropTypes.bool,
  isNewlyCreated: PropTypes.bool,
};

const mapDispatchToProps = {
  fetchTags: tagActions.fetchTags,
  fetchLicenses: licenseActions.fetchLicenses,
  fetchImage: actions.fetchImage,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state, props) => {
  const { imageId } = props;
  const getImageSelector = getImage(imageId, true);
  const locale = getLocale(state);
  const getAllTagsSelector = getAllTagsByLanguage(locale);
  return {
    locale,
    tags: getAllTagsSelector(state),
    licenses: getAllLicenses(state),
    image: getImageSelector(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditImage),
);
