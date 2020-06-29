/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { connect } from 'react-redux';
import Button from '@ndla/button';
import { getLocale } from '../../modules/locale/locale';
import * as api from '../../modules/image/imageApi';
import FormikMetaImage from './components/FormikMetaImage';
import HowToHelper from '../../components/HowTo/HowToHelper';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import {
  getUploadedImage,
  getSaving as getSavingImage,
  actions as imageActions,
} from '../../modules/image/image';

class FormikMetaImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImageSelect: false,
      image: undefined,
    };
    this.onImageFetch = this.onImageFetch.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onImageSelectClose = this.onImageSelectClose.bind(this);
    this.onImageSelectOpen = this.onImageSelectOpen.bind(this);
  }

  componentDidUpdate({ metaImageId: prevMetaImageId }) {
    const { uploadedImage, clearUploadedImage, metaImageId } = this.props;
    if (uploadedImage && this.state.showImageSelect) {
      this.onImageChange(uploadedImage);
      clearUploadedImage();
    }

    if (metaImageId !== prevMetaImageId) {
      this.onImageFetch();
    }
  }

  componentDidMount() {
    this.onImageFetch();
  }

  componentWillUnmount() {
    const { uploadedImage, clearUploadedImage } = this.props;
    if (uploadedImage) {
      clearUploadedImage();
    }
  }

  async onImageFetch() {
    const { metaImageId, locale } = this.props;
    if (metaImageId) {
      const image = await api.fetchImage(metaImageId, locale);
      this.setState({ image });
    }
  }
  onImageChange(image) {
    this.onImageSelectClose();
    this.setState({ image });
    this.onChangeFormik(image.id);
  }

  onChangeFormik = value => {
    const { onChange, name } = this.props;
    onChange({
      target: {
        name,
        value: value,
      },
    });
  };

  onImageRemove = () => {
    this.onImageSelectClose();
    this.setState({ image: undefined });
    this.onChangeFormik(null);
  };

  onImageSelectClose() {
    this.props.setFieldTouched('metaImageAlt', true, true);

    this.setState({
      showImageSelect: false,
    });
  }

  onImageSelectOpen() {
    this.setState({
      showImageSelect: true,
    });
  }

  render() {
    const { t, locale, isSavingImage, showRemoveButton, banner } = this.props;
    const { image, showImageSelect } = this.state;
    const fetchImage = id => api.fetchImage(id, locale);
    return (
      <div>
        <FieldHeader title={!banner ? t('form.metaImage.title') : banner}>
          {!banner && (
            <HowToHelper
              pageId="MetaImage"
              tooltip={t('form.metaImage.helpLabel')}
            />
          )}
        </FieldHeader>
        <Modal
          controllable
          isOpen={showImageSelect}
          onClose={this.onImageSelectClose}
          size="large"
          backgroundColor="white"
          minHeight="90vh">
          {() => (
            <Fragment>
              <ModalHeader>
                <ModalCloseButton
                  title={t('dialog.close')}
                  onClick={this.onImageSelectClose}
                />
              </ModalHeader>
              <ModalBody>
                <ImageSearchAndUploader
                  onImageSelect={this.onImageChange}
                  locale={locale}
                  isSavingImage={isSavingImage}
                  closeModal={this.onImageSelectClose}
                  fetchImage={fetchImage}
                  searchImages={api.searchImages}
                  onError={api.onError}
                />
              </ModalBody>
            </Fragment>
          )}
        </Modal>
        {image ? (
          <FormikMetaImage
            image={image}
            onImageSelectOpen={this.onImageSelectOpen}
            onImageRemove={this.onImageRemove}
            showRemoveButton={showRemoveButton}
            banner={banner}
          />
        ) : (
          <Button onClick={this.onImageSelectOpen}>
            {!banner
              ? t('form.metaImage.add')
              : t('subjectpageForm.addBanner')}
          </Button>
        )}
      </div>
    );
  }
}

FormikMetaImageSearch.propTypes = {
  metaImageId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  uploadedImage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alttext: PropTypes.shape({
      alttext: PropTypes.string,
    }),
    caption: PropTypes.shape({
      caption: PropTypes.string,
    }),
  }),
  clearUploadedImage: PropTypes.func.isRequired,
  isSavingImage: PropTypes.bool,
  setFieldTouched: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool,
  banner: PropTypes.string,
};

const mapDispatchToProps = {
  clearUploadedImage: imageActions.clearUploadedImage,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  isSavingImage: getSavingImage(state),
  uploadedImage: getUploadedImage(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectT(FormikMetaImageSearch));
