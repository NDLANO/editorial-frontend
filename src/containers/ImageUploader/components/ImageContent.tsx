/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect, FieldProps, FormikContextType } from 'formik';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { UploadDropZone, TextArea } from '@ndla/forms';
import SafeLink from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import { ImageMeta } from '@ndla/image-search';
import { animations, spacing, colors } from '@ndla/core';
import IconButton from '../../../components/IconButton';
import FormikField from '../../../components/FormikField';
import { ImageFormikType } from '../imageTransformers';
import { TitleField } from '../../FormikForm';

const StyledImage = styled.img`
  margin: ${spacing.normal} 0;
  border: 1px solid ${colors.brand.greyLight};
  ${animations.fadeInBottom()}
`;

const StyledDeleteButtonContainer = styled.div`
  position: absolute;
  right: -${spacing.medium};
  transform: translateY(${spacing.normal});
  display: flex;
  flex-direction: row;
`;

interface Props {
  formik: FormikContextType<ImageFormikType>;
}

const ImageContent = ({ formik }: Props) => {
  const { t } = useTranslation();
  const { values, errors, setFieldValue, submitForm } = formik;
  return (
    <>
      <TitleField handleSubmit={submitForm} />
      {!values.imageFile && (
        <UploadDropZone
          name="imageFile"
          allowedFiles={['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']}
          onAddedFiles={(_, evt) => {
            const target = evt.target;
            setFieldValue(
              'filepath',
              target.files?.[0] ? URL.createObjectURL(target.files[0]) : undefined,
            );
            Promise.resolve(
              createImageBitmap(target.files?.[0] as Blob).then(image => {
                setFieldValue('imageDimensions', image);
              }),
            );
            setFieldValue('imageFile', target.files?.[0]);
            setFieldValue('contentType', target.files?.[0]?.type);
            setFieldValue('fileSize', target.files?.[0]?.size);
          }}
          ariaLabel={t('form.image.dragdrop.ariaLabel')}>
          <strong>{t('form.image.dragdrop.main')}</strong>
          {t('form.image.dragdrop.sub')}
        </UploadDropZone>
      )}
      {values.imageFile && (
        <StyledDeleteButtonContainer>
          <Tooltip tooltip={t('form.image.removeImage')}>
            <IconButton
              type="button"
              onClick={() => {
                setFieldValue('imageFile', undefined);
              }}
              tabIndex={-1}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </StyledDeleteButtonContainer>
      )}
      {values.imageFile && (
        <>
          <SafeLink target="_blank" to={values.imageFile}>
            <StyledImage src={values.filepath || values.imageFile} alt="" />
          </SafeLink>
          <ImageMeta
            contentType={values.contentType ?? ''}
            fileSize={values.fileSize ?? 0}
            imageDimensions={values.imageDimensions}
          />
        </>
      )}
      <FormikField name="imageFile.size" showError={true}>
        {_ => <></>}
      </FormikField>
      <FormikField name="caption" showError={false}>
        {({ field }: FieldProps) => (
          <TextArea
            placeholder={t('form.image.caption.placeholder')}
            label={t('form.image.caption.label')}
            type="text"
            warningText={errors['caption']}
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="alttext" showError={false}>
        {({ field }: FieldProps) => (
          <TextArea
            placeholder={t('form.image.alt.placeholder')}
            label={t('form.image.alt.label')}
            type="text"
            warningText={errors['alttext']}
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default connect<any, any>(ImageContent);
