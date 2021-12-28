/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { spacing, colors, animations } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { UploadDropZone } from '@ndla/forms';
import { DeleteForever } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import FormField from '../../../components/Form';
import IconButton from '../../../components/IconButton';
import { MAX_IMAGE_UPLOAD_SIZE } from '../../../constants';
import { bytesToSensibleFormat } from '../../../util/fileSizeUtil';
import { ImageFormType } from '../imageTransformers';

const StyledImage = styled.img`
  margin: ${spacing.normal} 0;
  border: 1px solid ${colors.brand.greyLight};
  ${animations.fadeInBottom()}
`;

const StyledDeleteButtonContainer = styled.div`
  position: absolute;
  right: -${spacing.medium};
  transform: translateY(${spacing.normal});
  z-index: 1;
  display: flex;
  flex-direction: row;
`;

const getImageUrl = (file: string | any): string => (typeof file === 'string' ? file : '');

const ImageFormField = () => {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState('');
  const { setError } = useFormContext();
  return (
    <FormField<ImageFormType, 'imageFile'> name="imageFile">
      {({ value, onChange }) => {
        if (!value) {
          return (
            <UploadDropZone
              name="imageFile"
              allowedFiles={['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']}
              onAddedFiles={(files: FileList, evt: InputEvent) => {
                const target = evt.target as HTMLInputElement;
                const image = target.files?.[0];
                if (!image) return;
                setFilePath(URL.createObjectURL(image));
                if (image.size > MAX_IMAGE_UPLOAD_SIZE) {
                  setError('imageFile', {
                    message: t('validation.maxSizeExceeded', {
                      maxSize: bytesToSensibleFormat(MAX_IMAGE_UPLOAD_SIZE),
                      fileSize: bytesToSensibleFormat(image.size),
                    }),
                  });
                } else {
                  onChange(image);
                }
              }}
              ariaLabel={t('form.image.dragdrop.ariaLabel')}>
              <strong>{t('form.image.dragdrop.main')}</strong>
              {t('form.image.dragdrop.sub')}
            </UploadDropZone>
          );
        }
        return (
          <>
            <StyledDeleteButtonContainer>
              <Tooltip tooltip={t('form.image.removeImage')}>
                <IconButton
                  type="button"
                  onClick={() => {
                    onChange(undefined);
                  }}
                  tabIndex={-1}>
                  <DeleteForever />
                </IconButton>
              </Tooltip>
            </StyledDeleteButtonContainer>
            <SafeLink target="_blank" to={getImageUrl(value)}>
              <StyledImage src={filePath || getImageUrl(value)} alt="" />
            </SafeLink>
          </>
        );
      }}
    </FormField>
  );
};

export default ImageFormField;
