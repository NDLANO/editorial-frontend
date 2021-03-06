/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, Fragment } from 'react';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import { fetchLicenses } from '../modules/draft/draftApi';
import ImageForm from '../containers/ImageUploader/components/ImageForm';
import { ImageSearchQuery } from '../modules/image/imageApiInterfaces';
import { ImageType, License } from '../interfaces';
import EditorErrorMessage from './SlateEditor/EditorErrorMessage';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: () => void;
  locale: string;
  isSavingImage?: boolean;
  closeModal: () => void;
  onError: () => void;
  searchImages: (queryObject: ImageSearchQuery) => void;
  fetchImage: () => void;
  image: ImageType;
  updateImage: () => void;
}

const ImageSearchAndUploader = ({
  image,
  updateImage,
  onImageSelect,
  closeModal,
  locale,
  fetchImage,
  searchImages,
  onError,
  t,
}: Props & tType) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [licenses, setLicenses] = useState<License[]>();
  useEffect(() => {
    fetchLicenses().then(licenses => setLicenses(licenses));
  }, []);

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
          content: licenses ? (
            <ImageForm
              image={image || { language: locale }}
              onUpdate={updateImage}
              closeModal={closeModal}
              licenses={licenses}
            />
          ) : (
            <EditorErrorMessage msg={t('errorMessage.description')} />
          ),
        },
      ]}
    />
  );
};

export default injectT(ImageSearchAndUploader);
