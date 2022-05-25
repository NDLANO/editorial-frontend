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
  const [image, setImage] = useState<IImageMetaInformationV2>();

  useEffect(() => {
    if (embed.imageid) {
      fetchImage(embed.imageid, language).then(data => {
        setImage(data);
      });
    }
  }, [embed.imageid, language]);

  const licenses = image?.copyright
    ? getLicenseByAbbreviation(image.copyright.license.license, language).rights
    : [];

  return (
    <ResourceBoxWrapper contentEditable={false}>
      <ResourceBox
        image={image?.imageUrl || ''}
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
