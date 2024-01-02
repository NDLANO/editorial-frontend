/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import { IImageMetaInformationV3, ISearchResultV3 } from '@ndla/types-backend/image-api';
import CreateImage from '../containers/ImageUploader/CreateImage';
import { ImageSearchQuery } from '../modules/image/imageApiInterfaces';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: (image: IImageMetaInformationV3) => void;
  inModal?: boolean;
  locale: string;
  language?: string;
  closeModal: () => void;
  onError: (err: any) => void;
  searchImages: (query: ImageSearchQuery) => Promise<ISearchResultV3>;
  fetchImage: (id: number) => Promise<IImageMetaInformationV3>;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

const ImageSearchAndUploader = ({
  onImageSelect,
  locale,
  language,
  inModal,
  closeModal,
  onError,
  searchImages,
  fetchImage,
  showCheckbox,
  checkboxAction,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const searchImagesWithParameters = (query?: string, page?: number) => {
    return searchImages({ query, page, 'page-size': 16, language: language, fallback: true });
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      tabs={[
        {
          title: t(`form.visualElement.image`),
          id: 'image',
          content: (
            <ImageSearch
              fetchImage={fetchImage}
              searchImages={searchImagesWithParameters}
              locale={locale}
              searchPlaceholder={t('imageSearch.placeholder')}
              searchButtonTitle={t('imageSearch.buttonTitle')}
              useImageTitle={t('imageSearch.useImage')}
              checkboxLabel={t('imageSearch.metaImageCheckboxLabel')}
              onImageSelect={onImageSelect}
              noResults={
                <>
                  <StyledTitleDiv>{t('imageSearch.noResultsText')}</StyledTitleDiv>
                  <ButtonV2 type="submit" variant="outline" onClick={() => setSelectedTab('upload')}>
                    {t('imageSearch.noResultsButtonText')}
                  </ButtonV2>
                </>
              }
              onError={onError}
              showCheckbox={showCheckbox}
              checkboxAction={checkboxAction}
            />
          ),
        },
        {
          title: t('form.visualElement.imageUpload'),
          id: 'upload',
          content: (
            <CreateImage inModal={inModal} editingArticle closeModal={closeModal} onImageCreated={onImageSelect} />
          ),
        },
      ]}
    />
  );
};

export default ImageSearchAndUploader;
