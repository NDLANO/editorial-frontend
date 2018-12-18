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
import { FormHeader, FormSections, FormInput } from '@ndla/forms';
import {
  PlainTextField,
  MultiSelectField,
  RemainingCharacters,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';

const TopicArticleMetadata = ({ t, bindInput, commonFieldProps, tags }) => (
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
    <FormHeader
      title={t('form.metaDescription.label')}
      subTitle={t('form.metaDescription.description')}
    />
    <FormSections>
      <div>
        <FormInput
          container="div"
          maxLength={155}
          autoExpand
          {...commonFieldProps}
        />
      </div>
      <div>
        <RemainingCharacters
          maxLength={155}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={bindInput('metaDescription').value.document.text}
        />
      </div>
    </FormSections>
    <PlainTextField
      label={t('form.metaDescription.label')}
      placeholder={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}
      name="metaDescription"
      maxLength={155}
      {...commonFieldProps}
    />
  </Fragment>
);

TopicArticleMetadata.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(TopicArticleMetadata);
