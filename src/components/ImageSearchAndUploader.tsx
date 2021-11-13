/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  ImageApiType,
  ImageSearchQuery,
  ImageSearchResult,
} from '../modules/image/imageApiInterfaces';
import CreateImage from '../containers/ImageUploader/CreateImage';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: (image: ImageApiType) => void;
  inModal?: boolean;
  locale: string;
  closeModal: () => void;
  onError: Function;
  searchImages: (query: ImageSearchQuery) => Promise<ImageSearchResult>;
  fetchImage: (id: string) => Promise<ImageApiType>;
  showMetaImageCheckbox?: boolean;
  onSaveAsMetaImage?: (image: ImageApiType) => void;
}

const ImageSearchAndUploader = ({
  onImageSelect,
  locale,
  inModal,
  closeModal,
  onError,
  searchImages,
  fetchImage,
  showMetaImageCheckbox,
  onSaveAsMetaImage,
}: Props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { t } = useTranslation();

  const searchImagesWithParameters = (query: string, page: number) => {
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
              metaImageCheckboxLabel={t('imageSearch.metaImageCheckboxLabel')}
              onImageSelect={onImageSelect}
              noResults={
                <>
                  <StyledTitleDiv>{t('imageSearch.noResultsText')}</StyledTitleDiv>
                  <Button
                    submit
                    outline
                    onClick={() => {
                      setSelectedTabIndex(1);
                    }}>
                    {t('imageSearch.noResultsButtonText')}
                  </Button>
                </>
              }
              onError={onError}
              showMetaImageCheckbox={showMetaImageCheckbox}
              onSaveAsMetaImage={onSaveAsMetaImage}
            />
          ),
        },
        {
          title: t('form.visualElement.imageUpload'),
          content: (
            <CreateImage
              inModal={inModal}
              editingArticle
              closeModal={closeModal}
              onImageCreated={onImageSelect}
            />
          ),
        },
      ]}
    />
  );
};

export default ImageSearchAndUploader;
