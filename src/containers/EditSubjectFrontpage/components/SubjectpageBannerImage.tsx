/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import MetaInformation from '../../../components/MetaInformation';
import config from '../../../config';
import { ImageEmbed } from '../../../interfaces';

const bannerImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

interface Props {
  image: ImageEmbed;
  onImageSelectOpen: MouseEventHandler<HTMLButtonElement>;
}

const SubjectpageBannerImage = ({ image, onImageSelectOpen }: Props) => {
  const { t } = useTranslation();
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
      <img src={src} style={{ background: colors.brand.primary }} alt={image.alt} />
      <div style={{ height: 5 }} />
      <MetaInformation
        title={image.caption}
        action={imageAction}
        translations={metaInformationTranslations}
      />
    </>
  );
};

export default SubjectpageBannerImage;
