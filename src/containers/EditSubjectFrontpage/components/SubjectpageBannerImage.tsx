/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import MetaInformation from '../../../components/MetaInformation';
import { VisualElement } from '../../../interfaces';
import config from '../../../config';

const bannerImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

interface Props {
  image: VisualElement;
  onImageSelectOpen: Function;
}

const SubjectpageBannerImage: FC<Props & tType> = ({ image, onImageSelectOpen, t }) => {
  const title = convertFieldWithFallback(image.metaData, 'title', '');
  const alt = convertFieldWithFallback(image, 'alt', '');
  const imageAction = (
    <Button css={bannerImageButtonStyle} onClick={onImageSelectOpen}>
      {t('subjectpageForm.changeBanner')}
    </Button>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
  };
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${image.resource_id}`;
  return (
    <>
      <img src={src} style={{ background: colors.brand.primary }} alt={alt} />
      <div style={{ height: 5 }} />
      <MetaInformation
        title={title}
        action={imageAction}
        translations={metaInformationTranslations}
      />
    </>
  );
};

export default injectT(SubjectpageBannerImage);
