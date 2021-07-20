/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import EditImage from '../containers/ImageUploader/EditImage';
import {
  ImageApiType,
  ImageSearchQuery,
  ImageSearchResult,
} from '../modules/image/imageApiInterfaces';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: (image: ImageApiType) => void;
  locale: string;
  isSavingImage: boolean;
  closeModal: () => void;
  onError: Function;
  searchImages: (query: ImageSearchQuery) => Promise<ImageSearchResult>;
  fetchImage: (id: string) => Promise<ImageApiType>;
}

const ImageSearchAndUploader = ({
  onImageSelect,
  locale,
  isSavingImage,
  closeModal,
  onError,
  searchImages,
  fetchImage,
  t,
}: Props & tType) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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
            />
          ),
        },
        {
          title: t('form.visualElement.imageUpload'),
          content: (
            <EditImage isSaving={isSavingImage} inModal editingArticle closeModal={closeModal} />
          ),
        },
      ]}
    />
  );
};

export default injectT(ImageSearchAndUploader);
