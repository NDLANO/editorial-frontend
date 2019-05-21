/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import EditImage from '../containers/ImageUploader/EditImage';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

const ImageSearchAndUploader = props => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {
    isSavingImage,
    onImageSelect,
    closeModal,
    locale,
    fetchImage,
    searchImages,
    onError,
    t,
  } = props;
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
              searchImages={searchImages}
              locale={locale}
              searchPlaceholder={t('imageSearch.placeholder')}
              searchButtonTitle={t('imageSearch.buttonTitle')}
              useImageTitle={t('imageSearch.useImage')}
              onImageSelect={onImageSelect}
              noResults={
                <Fragment>
                  <StyledTitleDiv>
                    {t('imageSearch.noResultsText')}
                  </StyledTitleDiv>
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
            <EditImage
              isSaving={isSavingImage}
              showSaved={false}
              inModal
              editingArticle
              closeModal={closeModal}
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
};

export default injectT(ImageSearchAndUploader);
