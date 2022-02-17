/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { IImageMetaInformationV2 as ImageApiType } from '@ndla/types-image-api';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import ImageSearch from '@ndla/image-search';
import { FieldHeader } from '@ndla/forms';
import MetaImageField from '../../FormikForm/components/MetaImageField';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { fetchImage, searchImages, onError } from '../../../modules/image/imageApi';
import { LocaleType } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  name: string;
}

const InlineImageSearch = ({ name }: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldValue, values } = useFormikContext<ConceptFormValues>();
  const [image, setImage] = useState<ImageApiType | undefined>();
  const locale: LocaleType = i18n.language;
  const fetchImageWithLocale = (id: number) => fetchImage(id, locale);
  const searchImagesWithParameters = (query?: string, page?: number) => {
    return searchImages({ query, page, 'page-size': 16 });
  };

  useEffect(() => {
    (async () => {
      if (values.metaImageId) {
        const image = await fetchImageWithLocale(parseInt(values.metaImageId));
        setImage(image);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (image) {
    return (
      <MetaImageField
        image={image}
        onImageSelectOpen={() => {
          setFieldValue(name, undefined);
          setImage(undefined);
        }}
        onImageRemove={() => {
          setFieldValue(name, undefined);
          setImage(undefined);
        }}
        showRemoveButton
      />
    );
  }
  return (
    <>
      <FieldHeader title={t('form.metaImage.title')}>
        <HowToHelper pageId="MetaImage" tooltip={t('form.metaImage.helpLabel')} />
      </FieldHeader>

      <ImageSearch
        fetchImage={fetchImageWithLocale}
        searchImages={searchImagesWithParameters}
        locale={locale}
        searchPlaceholder={t('imageSearch.placeholder')}
        searchButtonTitle={t('imageSearch.buttonTitle')}
        useImageTitle={t('imageSearch.useImage')}
        onImageSelect={(image: ImageApiType) => {
          setFieldValue(name, image.id);
          setImage(image);
        }}
        noResults={
          <>
            <StyledTitleDiv>{t('imageSearch.noResultsText')}</StyledTitleDiv>
            <Button submit outline>
              {t('imageSearch.noResultsButtonText')}
            </Button>
          </>
        }
        onError={onError}
      />
    </>
  );
};

export default InlineImageSearch;
