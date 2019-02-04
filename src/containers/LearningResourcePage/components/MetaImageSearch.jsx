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
import { FormHeader } from '@ndla/forms';
import ImageSearch from '@ndla/image-search';
import { connect } from 'react-redux';
import Button from '@ndla/button';
import { getLocale } from '../../../modules/locale/locale';
import * as api from '../../VisualElement/visualElementApi';
import Lightbox from '../../../components/Lightbox';
import MetaImage from './MetaImage';
import { CommonFieldPropsShape } from '../../../shapes';
import HowToHelper from '../../../components/HowTo/HowToHelper';

class MetaImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImageSearch: false,
      image: undefined,
    };
    this.onImageChange = this.onImageChange.bind(this);
    this.toggleImageSearchLightBox = this.toggleImageSearchLightBox.bind(this);
  }

  componentDidMount() {
    if (this.props.metaImageId) {
      api.fetchImage(this.props.metaImageId).then(image => {
        this.setState({ image });
      });
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
    const { image } = this.state;
    return (
      <div>
        <FormHeader title={t('learningResourceForm.fields.metaImage.title')}>
          <HowToHelper
            pageId="MetaImage"
            tooltip={t('learningResourceForm.fields.metaImage.helpLabel')}
          />
        </FormHeader>
        <Lightbox
          display={this.state.showImageSearch}
          appearance="big"
          onClose={this.toggleImageSearchLightBox}>
          <ImageSearch
            fetchImage={api.fetchImage}
            searchImages={api.searchImages}
            locale={locale}
            searchPlaceholder={t('imageSearch.placeholder')}
            searchButtonTitle={t('imageSearch.buttonTitle')}
            useImageTitle={t('imageSearch.useImage')}
            onImageSelect={img => this.onImageChange(img)}
            onError={api.onError}
          />
        </Lightbox>
        {image ? (
          <MetaImage
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

MetaImageSearch.propTypes = {
  metaImageId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(MetaImageSearch));
