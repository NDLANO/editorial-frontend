/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import ImageSearch from 'ndla-image-search';
import { connect } from 'react-redux';
import { Button } from 'ndla-ui';
import { getLocale } from '../../../modules/locale/locale';
import { classes } from '../../../components/Fields';
import * as api from '../../VisualElement/visualElementApi';
import Lightbox from '../../../components/Lightbox';
import MetaImage from './MetaImage';

class MetaImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImageSearch: false,
      image: undefined,
    };
    this.hideVisualElement = this.hideVisualElement.bind(this);
    this.showVisualElement = this.showVisualElement.bind(this);
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

  showVisualElement() {
    this.setState({ showVisualElement: true });
  }

  hideVisualElement() {
    this.setState({ showVisualElement: false });
  }

  toggleImageSearchLightBox() {
    this.setState(prevState => ({
      showImageSearch: !prevState.showImageSearch,
    }));
  }

  render() {
    const { t, locale } = this.props;
    const { image } = this.state;
    return (
      <div>
        <h3 {...classes('learning-resource-meta-image')}>
          {t('learningResourceForm.fields.metaImage.title')}
        </h3>
        <Lightbox
          display={this.state.showImageSearch}
          big
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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(MetaImageSearch));
