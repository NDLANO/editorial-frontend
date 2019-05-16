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
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getLocale } from '../../modules/locale/locale';
import ImageForm from './components/ImageForm';
import { actions } from '../../modules/image/image';
import { ImageShape } from '../../shapes';

class CreateImage extends Component {
  componentDidMount() {
    const { fetchTags, fetchLicenses, locale } = this.props;
    fetchTags({ language: locale });
    fetchLicenses();
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

    return (
      <ImageForm
        image={{ language: locale }}
        onUpdate={(image, file) => {
          updateImage({ image, file, history, editingArticle });
        }}
        closeModal={closeModal}
        {...rest}
      />
    );
  }
}

CreateImage.propTypes = {
  imageId: PropTypes.string,
  fetchTags: PropTypes.func.isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  fetchTags: tagActions.fetchTags,
  fetchLicenses: licenseActions.fetchLicenses,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state, props) => {
  const locale = getLocale(state);
  const getAllTagsSelector = getAllTagsByLanguage(locale);
  return {
    locale,
    tags: getAllTagsSelector(state),
    licenses: getAllLicenses(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CreateImage),
);
