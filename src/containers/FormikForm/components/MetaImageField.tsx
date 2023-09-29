/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { IconButtonV2 } from '@ndla/button';
import { Link } from '@ndla/icons/common';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import MetaInformation from '../../../components/MetaInformation';
import FormikField from '../../../components/FormikField';

const MetaImageContainer = styled.div`
  display: flex;
`;

const StyledImage = styled.img`
  align-self: flex-start;
  max-width: 60%;
  margin-top: 10px;
`;

interface Props {
  disableAltEditing?: boolean;
  image: IImageMetaInformationV3;
  onImageRemove: () => void;
  showRemoveButton: boolean;
  onImageLoad?: (width: number, height: number) => void;
}

const MetaImageField = ({ image, onImageRemove, onImageLoad, disableAltEditing }: Props) => {
  const { t } = useTranslation();
  const copyright = image.copyright.creators.map((creator) => creator.name).join(', ');
  const title = convertFieldWithFallback<'title'>(image, 'title', '');
  const alt = convertFieldWithFallback<'alttext'>(image, 'alttext', '');
  const imageAction = (
    <>
      <Tooltip tooltip={t('form.image.removeImage')}>
        <IconButtonV2
          aria-label={t('form.image.removeImage')}
          colorTheme="danger"
          variant="ghost"
          onClick={onImageRemove}
          tabIndex={-1}
          data-testid="remove-element"
        >
          <DeleteForever />
        </IconButtonV2>
      </Tooltip>
      <Tooltip tooltip={t('form.image.editImage')}>
        <SafeLinkIconButton
          variant="ghost"
          colorTheme="light"
          to={`/media/image-upload/${image.id}/edit/${image.title.language}`}
          target="_blank"
        >
          <Link />
        </SafeLinkIconButton>
      </Tooltip>
    </>
  );
  const metaInformationTranslations = {
    title: t('form.metaImage.imageTitle'),
    copyright: t('form.metaImage.copyright'),
    alt: t('form.name.alttext'),
  };
  const imageUrl = `${image.image.imageUrl}?width=400`;
  const { width, height } = image.image?.dimensions || { width: 0, height: 0 };
  const onLoad = (_: SyntheticEvent<HTMLImageElement, Event>) => {
    onImageLoad?.(width, height);
  };
  return (
    <>
      <MetaImageContainer>
        <StyledImage src={imageUrl} alt={alt} onLoad={onLoad} />
        <MetaInformation
          title={title}
          copyright={copyright}
          action={imageAction}
          alt={disableAltEditing ? alt : undefined}
          translations={metaInformationTranslations}
        />
      </MetaImageContainer>
      {!disableAltEditing && (
        <FormikField
          label={t('topicArticleForm.fields.alt.label')}
          name="metaImageAlt"
          noBorder
          placeholder={t('topicArticleForm.fields.alt.placeholder')}
          maxLength={300}
        />
      )}
    </>
  );
};

export default MetaImageField;
