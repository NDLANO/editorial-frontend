/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import MetaInformation from '../../../components/MetaInformation';
import { Image, TranslateType } from '../../../interfaces';

const bannerImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

interface Props {
  image: Image;
  onImageSelectOpen: Function;
  t: TranslateType;
}

const SubjectpageBannerImage: FC<Props> = ({ image, onImageSelectOpen, t }) => {
  const copyright =
    image.copyright && image.copyright.creators
      ? image.copyright.creators.map(creator => creator.name).join(', ')
      : undefined;
  const title = convertFieldWithFallback(image, 'title', '');
  const alt = convertFieldWithFallback(image, 'alttext', '');
  const imageAction = (
    <>
      <Button css={bannerImageButtonStyle} onClick={onImageSelectOpen}>
        {t('subjectpageForm.changeBanner')}
      </Button>
    </>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
  };
  return (
    <>
      <img
        src={image.imageUrl}
        style={{ width: 1500, background: colors.brand.primary }}
        alt={alt}
      />
      <div style={{ height: 5 }} />
      <MetaInformation
        title={title}
        copyright={copyright}
        action={imageAction}
        translations={metaInformationTranslations}
      />
    </>
  );
};

export default injectT(SubjectpageBannerImage);
