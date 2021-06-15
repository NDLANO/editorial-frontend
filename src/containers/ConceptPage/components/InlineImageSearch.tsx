/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useState } from 'react';
import { useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import ImageSearch from '@ndla/image-search';
import { FieldHeader } from '@ndla/forms';

import MetaImageField from '../../FormikForm/components/MetaImageField';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { fetchImage, searchImages, onError } from '../../../modules/image/imageApi';
import { ImageApiType } from '../../../modules/image/imageApiInterfaces';
import { LocaleContext } from '../../App/App';
import { LocaleType } from '../../../interfaces';

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

interface Props {
  name: string;
}

const InlineImageSearch = ({ name, t }: Props & tType) => {
  const { setFieldValue } = useFormikContext();
  const [image, setImage] = useState<ImageApiType | undefined>(undefined);
  const locale: LocaleType = useContext(LocaleContext);
  const fetchImageWithLocale = (id: number) => fetchImage(id, locale);
  const searchImagesWithParameters = (query: string, page: number) => {
    return searchImages({ query, page, 'page-size': 16 });
  };

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

export default injectT(InlineImageSearch);
