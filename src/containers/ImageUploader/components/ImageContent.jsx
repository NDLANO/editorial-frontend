/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { injectT } from '@ndla/i18n';
import { UploadDropZone, Input } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import { animations, spacing, colors } from '@ndla/core';
import { TextField, getField } from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import IconButton from '../../../components/IconButton';

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

const ImageContent = ({ t, commonFieldProps, model }) => {
  const { bindInput, schema, submitted } = { ...commonFieldProps };
  return (
    <Fragment>
      <TextField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        maxLength={300}
        placeholder={t('form.title.label')}
        {...commonFieldProps}
      />
      {!model.imageFile && (
        <UploadDropZone
          name="imageFile"
          allowedFiles={[
            'image/gif',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/svg+xml',
          ]}
          onAddedFiles={(files, e) => {
            const bindInputs = { ...bindInput('imageFile') };
            bindInputs.onChange(e);
          }}
          ariaLabel={t('form.image.dragdrop.ariaLabel')}>
          <strong>{t('form.image.dragdrop.main')}</strong>{' '}
          {t('form.image.dragdrop.sub')}
        </UploadDropZone>
      )}
      {!model.id && model.imageFile && (
        <StyledDeleteButtonContainer>
          <Tooltip tooltip={t('form.image.removeImage')}>
            <IconButton
              onClick={() => {
                const bindInputs = { ...bindInput('imageFile') };
                bindInputs.onChange({
                  target: {
                    name: 'imageFile',
                    type: 'file',
                  },
                });
              }}
              tabIndex={-1}
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </StyledDeleteButtonContainer>
      )}
      {model.imageFile && (
        <StyledImage src={model.filepath || model.imageFile} alt="" />
      )}
      <Input
        name="caption"
        placeholder={t(`form.image.caption.placeholder`)}
        label={t(`form.image.caption.label`)}
        container="div"
        type="text"
        autoExpand
        warningText={
          submitted
            ? getField('caption', schema)
                .errors.map(error => error('caption'))
                .toString('. ')
            : undefined
        }
        {...bindInput('caption')}
      />
      <Input
        placeholder={t('form.image.alt.placeholder')}
        label={t('form.image.alt.label')}
        name="alttext"
        container="div"
        type="text"
        autoExpand
        warningText={
          submitted
            ? getField('alttext', schema)
                .errors.map(error => error('alttext'))
                .toString('. ')
            : undefined
        }
        {...bindInput('alttext')}
      />
    </Fragment>
  );
};

ImageContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default injectT(ImageContent);
