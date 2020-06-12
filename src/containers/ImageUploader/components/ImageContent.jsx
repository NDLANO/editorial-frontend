/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
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

const ImageContent = ({
  t,
  formik: { values, touched, errors, setFieldValue },
}) => {
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
          allowedFiles={[
            'image/gif',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/svg+xml',
          ]}
          onAddedFiles={(files, evt) => {
            setFieldValue(
              'filepath',
              evt.target && evt.target.files[0]
                ? URL.createObjectURL(evt.target.files[0])
                : undefined,
            );
            setFieldValue('imageFile', evt.target.files[0]);
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
      {values.imageFile && (
        <StyledImage src={values.filepath || values.imageFile} alt="" />
      )}
      <FormikField name="caption" showError={false}>
        {({ field }) => (
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
        {({ field }) => (
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

ImageContent.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      alttext: PropTypes.string,
      caption: PropTypes.string,
      id: PropTypes.number,
      imageFile: PropTypes.string,
      filepath: PropTypes.string,
    }),
    errors: PropTypes.shape({
      alttext: PropTypes.string,
      caption: PropTypes.string,
    }),
    touched: PropTypes.shape({
      alttext: PropTypes.bool,
      caption: PropTypes.bool,
    }),
    setFieldValue: PropTypes.func.isRequired,
  }),
};

export default injectT(connect(ImageContent));
