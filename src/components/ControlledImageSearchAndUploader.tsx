/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import ImageSearch from '@ndla/image-search';
import Tabs from '@ndla/tabs';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import ImageForm from '../containers/ImageUploader/components/ImageForm';
import {
  ImageApiType,
  ImageSearchQuery,
  UpdatedImageMetadata,
} from '../modules/image/imageApiInterfaces';
import EditorErrorMessage from './SlateEditor/EditorErrorMessage';
import { useLicenses } from '../containers/Licenses/LicensesProvider';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  onImageSelect: (image: ImageApiType) => void;
  locale: string;
  closeModal: () => void;
  onError: (err: Error & Response) => void;
  searchImages: (queryObject: ImageSearchQuery) => void;
  fetchImage: (id: number) => Promise<ImageApiType>;
  image?: ImageApiType;
  updateImage: (imageMetadata: UpdatedImageMetadata, image: string | Blob) => void;
  inModal?: boolean;
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
  inModal = false,
}: Props) => {
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { licenses } = useLicenses();
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
          content: licenses ? (
            <ImageForm
              language={locale}
              inModal={inModal}
              image={image}
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

export default ImageSearchAndUploader;
