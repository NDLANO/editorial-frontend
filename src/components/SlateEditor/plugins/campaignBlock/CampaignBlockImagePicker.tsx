/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, fonts } from '@ndla/core';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import ImageSearch from '@ndla/image-search';
import { useTranslation } from 'react-i18next';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/icons';
import { DeleteForever } from '@ndla/icons/editor';
import { CampaignBlockFormValues } from './CampaignBlockForm';
import { fetchImage, onError, searchImages } from '../../../../modules/image/imageApi';

const ImagePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;
const PickerWrapper = styled.div`
  display: flex;
  gap: ${spacing.normal};
`;

const CampaignBlockImagePicker = () => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue } = useFormikContext<CampaignBlockFormValues>();

  return (
    <ImagePickerWrapper>
      <FieldHeader title="Bilder" />
      <PickerWrapper>
        <ImagePicker
          titleText={t('campaignBlockForm.image.imageBefore')}
          id={values.imageBeforeId}
          onChange={(image) => {
            setFieldValue('imageBeforeId', image?.id);
            setTimeout(() => {
              setFieldTouched('imageBeforeId', true, true);
            }, 0);
          }}
          buttonText={t('campaignBlockForm.image.insertImageBefore')}
        />
        <ImagePicker
          titleText={t('campaignBlockForm.image.imageAfter')}
          id={values.imageAfterId}
          onChange={(image) => {
            setFieldValue('imageAfterId', image?.id);
            setTimeout(() => {
              setFieldTouched('imageAfterId', true, true);
            }, 0);
          }}
          buttonText={t('campaignBlockForm.image.insertImageAfter')}
        />
      </PickerWrapper>
    </ImagePickerWrapper>
  );
};

interface ImageProps {
  id?: string;
  onChange: (image?: IImageMetaInformationV3) => void;
  buttonText: string;
  titleText: string;
}

const ChooseWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${spacing.small};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.small};
  span {
    font-weight: ${fonts.weight.bold};
  }
`;

const searchImagesWithParameters = (query?: string, page?: number) =>
  searchImages({ query, page, 'page-size': 16 });

const ImagePicker = ({ id, onChange, buttonText, titleText }: ImageProps) => {
  const { t, i18n } = useTranslation();
  const [choosingImage, setChoosingImage] = useState(false);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  useEffect(() => {
    if (id) {
      fetchImage(id, i18n.language).then(setImage);
    }
  }, [i18n.language, id]);

  if (!id) {
    return (
      <ChooseWrapper>
        <ButtonV2 onClick={() => setChoosingImage(true)}>{buttonText}</ButtonV2>
        {choosingImage && (
          <ImageSearch
            fetchImage={fetchImage}
            locale={i18n.language}
            searchImages={searchImagesWithParameters}
            searchPlaceholder={t('imageSearch.placeholder')}
            searchButtonTitle={t('imageSearch.buttonTitle')}
            useImageTitle={t('imageSearch.useImage')}
            onImageSelect={(image: IImageMetaInformationV3) => {
              onChange(image);
              setChoosingImage(false);
            }}
            noResults={t('imageSearch.noResultsText')}
            onError={onError}
          />
        )}
      </ChooseWrapper>
    );
  }

  if (!image) {
    return <Spinner />;
  }

  return (
    <ChooseWrapper>
      <TitleWrapper>
        <span>{titleText}</span>
        <IconButtonV2
          aria-label={t('form.image.removeImage')}
          colorTheme="danger"
          variant="ghost"
          onClick={() => {
            setImage(undefined);
            onChange(undefined);
          }}
          tabIndex={-1}
          data-cy="remove-element"
        >
          <DeleteForever />
        </IconButtonV2>
      </TitleWrapper>
      <img src={image.image.imageUrl} alt="" />
    </ChooseWrapper>
  );
};

export default CampaignBlockImagePicker;
