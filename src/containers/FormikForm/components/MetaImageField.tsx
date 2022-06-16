/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { DeleteForever } from '@ndla/icons/lib/editor';
import Tooltip from '@ndla/tooltip';
import { Link as LinkIcon } from '@ndla/icons/common';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import MetaInformation from '../../../components/MetaInformation';
import FormikField from '../../../components/FormikField';

import IconButton from '../../../components/IconButton';

const MetaImageContainer = styled.div`
  display: flex;
`;

const StyledImage = styled.img`
  align-self: flex-start;
  max-width: 60%;
  margin-top: 10px;
`;

interface Props {
  image: IImageMetaInformationV2;
  onImageSelectOpen: () => void;
  onImageRemove: () => void;
  showRemoveButton: boolean;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const MetaImageField = ({ image, onImageRemove, onImageLoad }: Props) => {
  const { t } = useTranslation();
  const copyright = image.copyright.creators.map(creator => creator.name).join(', ');
  const title = convertFieldWithFallback<'title'>(image, 'title', '');
  const alt = convertFieldWithFallback<'alttext'>(image, 'alttext', '');
  const imageAction = (
    <>
      <Tooltip tooltip={t('form.image.removeImage')} align="right">
        <IconButton
          color="red"
          type="button"
          onClick={onImageRemove}
          tabIndex={-1}
          data-cy="remove-element">
          <DeleteForever />
        </IconButton>
      </Tooltip>
      <Tooltip tooltip={t('form.image.editImage')} align="top">
        <IconButton
          as={Link}
          to={`/media/image-upload/${image.id}/edit/${image.title.language}`}
          target="_blank"
          title={t('form.editOriginalImage')}
          tabIndex={-1}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
  };
  return (
    <>
      <MetaImageContainer>
        <StyledImage src={image.imageUrl} alt={alt} onLoad={onImageLoad} />
        <MetaInformation
          title={title}
          copyright={copyright}
          action={imageAction}
          translations={metaInformationTranslations}
        />
      </MetaImageContainer>
      <FormikField
        label={t('topicArticleForm.fields.alt.label')}
        name="metaImageAlt"
        noBorder
        placeholder={t('topicArticleForm.fields.alt.placeholder')}
        maxLength={300}
      />
    </>
  );
};

export default MetaImageField;
