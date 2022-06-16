/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { ResourceBox } from '@ndla/ui';
import { useEffect, useState } from 'react';
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
  const [imageMeta, setImageMeta] = useState<IImageMetaInformationV2>();

  useEffect(() => {
    if (embed.imageid) {
      fetchImage(embed.imageid, language).then(data => {
        setImageMeta(data);
      });
    }
  }, [embed.imageid, language]);

  const licenses = imageMeta?.copyright
    ? getLicenseByAbbreviation(imageMeta.copyright.license.license, language).rights
    : [];

  const image = {
    src: imageMeta?.imageUrl || '',
    alt: imageMeta?.alttext.alttext || '',
  };

  return (
    <ResourceBoxWrapper contentEditable={false}>
      <ResourceBox
        image={image}
        title={embed?.title || ''}
        caption={embed.caption || ''}
        licenseRights={licenses}
        locale={language}
        url={embed.url}
      />
    </ResourceBoxWrapper>
  );
};

export default SlateResourceBox;
