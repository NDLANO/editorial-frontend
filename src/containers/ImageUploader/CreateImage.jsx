/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getLocale } from '../../modules/locale/locale';
import ImageForm from './components/ImageForm';
import { actions } from '../../modules/image/image';
import { ImageShape } from '../../shapes';
import { createFormData } from '../../util/formDataHelper';
import * as imageApi from '../../modules/image/imageApi';
import { toEditImage } from '../../util/routeHelpers';

class CreateImage extends Component {
  componentDidMount() {
    this.props.fetchLicenses();
  }

  render() {
    const {
      history,
      updateImage,
      locale,
      editingArticle,
      closeModal,
      ...rest
    } = this.props;

    const onCreateImage = async (newImage, file) => {
      const formData = await createFormData(file,newImage);
      const createdImage = await imageApi.postImage(formData);
      if(!newImage.id) {
        history.push(toEditImage(createdImage.id,newImage.language))
      }
    };

    return (
      <ImageForm
        image={{ language: locale }}
        onUpdate={onCreateImage}
        closeModal={closeModal}
        {...rest}
      />
    );
  }
}

CreateImage.propTypes = {
  imageId: PropTypes.string,
  fetchLicenses: PropTypes.func.isRequired,
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
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state, props) => {
  const locale = getLocale(state);
  return {
    locale,
    licenses: getAllLicenses(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateImage),
);
