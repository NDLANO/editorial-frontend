/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import {
  PlainTextField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';
import { MetaImageShape, CommonFieldPropsShape } from '../../../shapes';
import MetaImageSearch from './MetaImageSearch';

const LearningResourceMetadata = ({
  t,
  bindInput,
  commonFieldProps,
  tags,
  model,
}) => (
  <div className="u-4/6@desktop u-push-1/6@desktop">
    <MultiSelectField
      obligatory
      name="tags"
      data={tags}
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      messages={{
        createOption: t('form.tags.createOption'),
        emptyFilter: t('form.tags.emptyFilter'),
        emptyList: t('form.tags.emptyList'),
      }}
      {...commonFieldProps}
    />
    <PlainTextField
      label={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}
      name="metaDescription"
      maxLength={155}
      {...commonFieldProps}>
      <RemainingCharacters
        maxLength={155}
        getRemainingLabel={(maxLength, remaining) =>
          t('form.remainingCharacters', { maxLength, remaining })
        }
        value={bindInput('metaDescription').value.document.text}
      />
    </PlainTextField>
    <MetaImageSearch
      metaImageId={model.metaImageId}
      commonFieldProps={commonFieldProps}
      {...bindInput('metaImageId')}
    />
  </div>
);

LearningResourceMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  model: PropTypes.shape({
    metaImage: MetaImageShape,
  }),
};

export default injectT(LearningResourceMetadata);
