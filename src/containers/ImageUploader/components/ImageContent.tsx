/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, Fragment } from 'react';
import { connect, FieldProps, FormikContextType } from 'formik';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import { UploadDropZone, Input } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import { animations, spacing, colors } from '@ndla/core';
import IconButton from '../../../components/IconButton';
import FormikField from '../../../components/FormikField';

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

interface Props {
  formik: FormikContextType<any>;
}

const ImageContent: FC<Props & tType> = ({ t, formik }) => {
  const { values, errors, setFieldValue } = formik;
  return (
    <Fragment>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      {!values.imageFile && (
        <UploadDropZone
          name="imageFile"
          allowedFiles={['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']}
          onAddedFiles={(files: FileList, evt: InputEvent) => {
            const target = evt.target as HTMLInputElement;
            setFieldValue(
              'filepath',
              target.files?.[0] ? URL.createObjectURL(target.files[0]) : undefined,
            );
            setFieldValue('imageFile', target.files?.[0]);
          }}
          ariaLabel={t('form.image.dragdrop.ariaLabel')}>
          <strong>{t('form.image.dragdrop.main')}</strong>
          {t('form.image.dragdrop.sub')}
        </UploadDropZone>
      )}
      {!values.id && values.imageFile && (
        <StyledDeleteButtonContainer>
          <Tooltip tooltip={t('form.image.removeImage')}>
            <IconButton
              onClick={() => {
                setFieldValue('imageFile', undefined);
              }}
              tabIndex={-1}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </StyledDeleteButtonContainer>
      )}
      {values.imageFile && <StyledImage src={values.filepath || values.imageFile} alt="" />}
      <FormikField name="caption" showError={false}>
        {({ field }: FieldProps) => (
          <Input
            placeholder={t('form.image.caption.placeholder')}
            label={t('form.image.caption.label')}
            container="div"
            type="text"
            autoExpand
            warningText={errors[field.name]}
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="alttext" showError={false}>
        {({ field }: FieldProps) => (
          <Input
            placeholder={t('form.image.alt.placeholder')}
            label={t('form.image.alt.label')}
            container="div"
            type="text"
            autoExpand
            warningText={errors[field.name]}
            {...field}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(connect<tType, any>(ImageContent));
