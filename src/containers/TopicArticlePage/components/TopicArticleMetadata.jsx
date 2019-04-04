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
import {
  PlainTextField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import { FormMetaImageSearch } from '../../Form';

const TopicArticleMetadata = ({ t, commonFieldProps, tags, model }) => {
  const { bindInput, ...handlers } = commonFieldProps;
  return (
    <Fragment>
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
        placeholder={t('form.metaDescription.label')}
        description={t('form.metaDescription.description')}
        name="metaDescription"
        maxLength={155}
        {...bindInput('metaDescription')}
        {...handlers}>
        <RemainingCharacters
          maxLength={155}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={bindInput('metaDescription').value.document.text}
        />
      </PlainTextField>
      <FormMetaImageSearch
        metaImageId={model.metaImageId}
        commonFieldProps={commonFieldProps}
        {...bindInput('metaImageId')}
      />
    </Fragment>
  );
};
TopicArticleMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  model: PropTypes.shape({
    metaImageId: PropTypes.string,
    metaImageAlt: PropTypes.string,
  }),
};

export default injectT(TopicArticleMetadata);
