/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ResourceBox } from '@ndla/ui';
import { ExternalEmbed } from '../../interfaces';
import { fetchImage } from '../../modules/image/imageApi';

interface Props {
  embed: ExternalEmbed;
  language: string;
}

const ResourceBoxWrapper = styled.div`
  ul {
    margin-top: 0;
  }
`;

const SlateResourceBox = ({ embed, language }: Props) => {
  const [imageMeta, setImageMeta] = useState<IImageMetaInformationV3>();
  const { t } = useTranslation();

  useEffect(() => {
    if (embed.imageid) {
      fetchImage(embed.imageid, language).then((data) => {
        setImageMeta(data);
      });
    }
  }, [embed.imageid, language]);

  const image = {
    src: imageMeta?.image.imageUrl || '',
    alt: imageMeta?.alttext.alttext || '',
  };

  return (
    <ResourceBoxWrapper contentEditable={false}>
      <ResourceBox
        image={image}
        title={embed?.title || ''}
        caption={embed.caption || ''}
        url={embed.url}
        buttonText={t('license.other.itemImage.ariaLabel')}
      />
    </ResourceBoxWrapper>
  );
};

export default SlateResourceBox;
