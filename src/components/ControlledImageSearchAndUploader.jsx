/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import { fetchLicenses } from '../modules/draft/draftApi';
import { ImageShape } from '../shapes';
import ImageForm from '../containers/ImageUploader/components/ImageForm';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

const ImageSearchAndUploader = props => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [licenses, setLicenses] = useState();
  useEffect(() => {
    fetchLicenses().then(licenses => setLicenses(licenses));
  }, []);

  const {
    image,
    updateImage,
    onImageSelect,
    closeModal,
    locale,
    fetchImage,
    searchImages,
    onError,
    t,
  } = props;

  const searchImagesWithParameters = (query, page) => {
    return searchImages({ query, page, 'page-size': 16 });
  };

  return (
    <Tabs
      onSelect={setSelectedTabIndex}
      selectedIndex={selectedTabIndex}
      tabs={[
        {
          title: t(`form.visualElement.image`),
          content: (
            <ImageSearch
              fetchImage={fetchImage}
              searchImages={searchImagesWithParameters}
              locale={locale}
              searchPlaceholder={t('imageSearch.placeholder')}
              searchButtonTitle={t('imageSearch.buttonTitle')}
              useImageTitle={t('imageSearch.useImage')}
              onImageSelect={onImageSelect}
              noResults={
                <Fragment>
                  <StyledTitleDiv>{t('imageSearch.noResultsText')}</StyledTitleDiv>
                  <Button
                    submit
                    outline
                    onClick={() => {
                      setSelectedTabIndex(1);
                    }}>
                    {t('imageSearch.noResultsButtonText')}
                  </Button>
                </Fragment>
              }
              onError={onError}
            />
          ),
        },
        {
          title: t('form.visualElement.imageUpload'),
          content: (
            <ImageForm
              image={image || { language: locale }}
              revision={image && image.revision}
              imageInfo={image && image.imageFile}
              onUpdate={updateImage}
              closeModal={closeModal}
              licenses={licenses}
            />
          ),
        },
      ]}
    />
  );
};

ImageSearchAndUploader.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSavingImage: PropTypes.bool,
  closeModal: PropTypes.func,
  onError: PropTypes.func.isRequired,
  searchImages: PropTypes.func.isRequired,
  fetchImage: PropTypes.func.isRequired,
  image: ImageShape,
  updateImage: PropTypes.func.isRequired,
};

export default injectT(ImageSearchAndUploader);
