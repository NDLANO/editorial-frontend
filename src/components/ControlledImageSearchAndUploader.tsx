/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import {
  IImageMetaInformationV3,
  IUpdateImageMetaInformation,
  ISearchResultV3,
} from '@ndla/types-backend/image-api';
import { useTranslation } from 'react-i18next';
import ImageForm from '../containers/ImageUploader/components/ImageForm';
import { ImageSearchQuery } from '../modules/image/imageApiInterfaces';
import EditorErrorMessage from './SlateEditor/EditorErrorMessage';
import { useLicenses } from '../modules/draft/draftQueries';
import { draftLicensesToImageLicenses } from '../modules/draft/draftApiUtils';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: (image: IImageMetaInformationV3) => void;
  locale: string;
  language?: string;
  closeModal: () => void;
  onError: (err: Error & Response) => void;
  searchImages: (queryObject: ImageSearchQuery) => Promise<ISearchResultV3>;
  fetchImage: (id: number) => Promise<IImageMetaInformationV3>;
  image?: IImageMetaInformationV3;
  updateImage: (
    imageMetadata: IUpdateImageMetaInformation,
    file: string | Blob,
    id?: number,
  ) => void;
  inModal?: boolean;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

const ImageSearchAndUploader = ({
  image,
  updateImage,
  onImageSelect,
  closeModal,
  locale,
  language,
  fetchImage,
  searchImages,
  onError,
  inModal = false,
  showCheckbox,
  checkboxAction,
}: Props) => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const searchImagesWithParameters = (query?: string, page?: number) => {
    return searchImages({ query, page, 'page-size': 16, language: language, fallback: true });
  };
  const imageLicenses = draftLicensesToImageLicenses(licenses ?? []);

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
              checkboxLabel={t('imageSearch.visualElementCheckboxLabel')}
              onImageSelect={onImageSelect}
              noResults={
                <>
                  <StyledTitleDiv>{t('imageSearch.noResultsText')}</StyledTitleDiv>
                  <ButtonV2
                    type="submit"
                    variant="outline"
                    onClick={() => {
                      setSelectedTabIndex(1);
                    }}
                  >
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
          content: licenses ? (
            <ImageForm
              language={locale}
              inModal={inModal}
              image={image}
              onSubmitFunc={updateImage}
              closeModal={closeModal}
              licenses={imageLicenses}
            />
          ) : (
            <EditorErrorMessage msg={t('errorMessage.description')} />
          ),
        },
      ]}
    />
  );
};

export default ImageSearchAndUploader;
