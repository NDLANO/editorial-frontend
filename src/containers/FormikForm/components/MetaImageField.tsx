/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { formClasses } from '..';
import MetaInformation from '../../../components/MetaInformation';
import FormikField from '../../../components/FormikField';
import { ImageApiType } from '../../../modules/image/imageApiInterfaces';

const metaImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

const metaImageDeleteButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
  min-height: 2.1rem;
  background-color: #ba292e;
  border: #ba292e;
  :hover {
    background-color: #8f2024;
    border: 0;
  }
  :focus {
    background-color: #8f2024;
    border: 0;
  }
`;

interface Props {
  image: ImageApiType;
  onImageSelectOpen: () => void;
  onImageRemove: () => void;
  showRemoveButton: boolean;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const MetaImageField = ({
  image,
  onImageSelectOpen,
  onImageRemove,
  showRemoveButton,
  onImageLoad,
}: Props) => {
  const { t } = useTranslation();
  const copyright = image.copyright.creators.map(creator => creator.name).join(', ');
  const title = convertFieldWithFallback<'title'>(image, 'title', '');
  const alt = convertFieldWithFallback<'alttext'>(image, 'alttext', '');
  const imageAction = (
    <>
      <Button css={metaImageButtonStyle} onClick={onImageSelectOpen}>
        {t('form.metaImage.change')}
      </Button>
      {showRemoveButton && (
        <Button css={metaImageDeleteButtonStyle} onClick={onImageRemove}>
          {t('form.metaImage.remove')}
        </Button>
      )}
    </>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
  };
  return (
    <Fragment>
      <div {...formClasses('meta-image')}>
        <img src={image.imageUrl} alt={alt} onLoad={onImageLoad} />
        <MetaInformation
          title={title}
          copyright={copyright}
          action={imageAction}
          translations={metaInformationTranslations}
        />
      </div>
      <FormikField
        label={t('topicArticleForm.fields.alt.label')}
        name="metaImageAlt"
        noBorder
        placeholder={t('topicArticleForm.fields.alt.placeholder')}
        maxLength={300}
      />
    </Fragment>
  );
};

export default MetaImageField;
