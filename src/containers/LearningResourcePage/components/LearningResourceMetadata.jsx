/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FormHeader } from '@ndla/forms';
import {
  PlainTextField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';
import { MetaImageShape, CommonFieldPropsShape } from '../../../shapes';
import MetaImageSearch from './MetaImageSearch';
import HowToHelper from '../../../components/HowTo/HowToHelper';

const LearningResourceMetadata = ({ t, commonFieldProps, tags, model }) => (
  <Fragment>
    <MultiSelectField
      obligatory
      name="tags"
      data={tags}
      howToId="MetaKeyword"
      howToTooltip={t('form.tags.helpLabel')}
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      messages={{
        createOption: t('form.tags.createOption'),
        emptyFilter: t('form.tags.emptyFilter'),
        emptyList: t('form.tags.emptyList'),
      }}
      {...commonFieldProps}
    />
    <FormHeader title={t('form.metaDescription.label')}>
      <HowToHelper
        pageId="MetaImage"
        tooltip={t('form.metaDescription.helpLabel')}
      />
    </FormHeader>
    <PlainTextField
      placeholder={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}
      name="metaDescription"
      maxLength={155}
      {...commonFieldProps.bindInput('metaDescription')}
      {...commonFieldProps}>
      <RemainingCharacters
        maxLength={155}
        getRemainingLabel={(maxLength, remaining) =>
          t('form.remainingCharacters', { maxLength, remaining })
        }
        value={
          commonFieldProps.bindInput('metaDescription').value.document.text
        }
      />
    </PlainTextField>
    <MetaImageSearch
      metaImageId={model.metaImageId}
      commonFieldProps={commonFieldProps}
      {...commonFieldProps.bindInput('metaImageId')}
    />
  </Fragment>
);

LearningResourceMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  model: PropTypes.shape({
    metaImage: MetaImageShape,
  }),
};

export default injectT(LearningResourceMetadata);
