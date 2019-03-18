/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import ImageSearch from '@ndla/image-search';
import { connect } from 'react-redux';
import Button from '@ndla/button';
import { getLocale } from '../../modules/locale/locale';
import * as api from '../../VisualElement/visualElementApi';
import Lightbox from '../../components/Lightbox';
import FormMetaImage from './components/FormMetaImage';
import { CommonFieldPropsShape } from '../../shapes';
import HowToHelper from '../../components/HowTo/HowToHelper';

class FormMetaImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImageSearch: false,
      image: undefined,
    };
    this.onImageChange = this.onImageChange.bind(this);
    this.toggleImageSearchLightBox = this.toggleImageSearchLightBox.bind(this);
  }

  async componentDidMount() {
    const { metaImageId } = this.props;
    if (metaImageId) {
      const image = await api.fetchImage(metaImageId);
      this.setState({ image });
    }
  }

  onImageChange(image) {
    this.toggleImageSearchLightBox();
    this.setState({ image });
    const { onChange, name } = this.props;
    onChange({
      target: {
        name,
        value: image.id,
      },
    });
  }

  toggleImageSearchLightBox() {
    this.setState(prevState => ({
      showImageSearch: !prevState.showImageSearch,
    }));
  }

  render() {
    const { t, locale, commonFieldProps } = this.props;
    const { image, showImageSearch } = this.state;
    return (
      <div>
        <FieldHeader title={t('learningResourceForm.fields.metaImage.title')}>
          <HowToHelper
            pageId="MetaImage"
            tooltip={t('learningResourceForm.fields.metaImage.helpLabel')}
          />
        </FieldHeader>
        <Lightbox
          display={showImageSearch}
          appearance="big"
          onClose={this.toggleImageSearchLightBox}>
          <ImageSearch
            fetchImage={api.fetchImage}
            searchImages={api.searchImages}
            locale={locale}
            searchPlaceholder={t('imageSearch.placeholder')}
            searchButtonTitle={t('imageSearch.buttonTitle')}
            useImageTitle={t('imageSearch.useImage')}
            onImageSelect={imageSelected => this.onImageChange(imageSelected)}
            onError={api.onError}
          />
        </Lightbox>
        {image ? (
          <FormMetaImage
            image={image}
            commonFieldProps={commonFieldProps}
            toggleImageSearchLightBox={this.toggleImageSearchLightBox}
          />
        ) : (
          <Button onClick={this.toggleImageSearchLightBox}>Velg bilde</Button>
        )}
      </div>
    );
  }
}

FormMetaImageSearch.propTypes = {
  metaImageId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(FormMetaImageSearch));
