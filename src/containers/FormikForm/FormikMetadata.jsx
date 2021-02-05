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

import FormikField from '../../components/FormikField';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import { FormikMetaImageSearch } from '.';
import AsyncSearchTags from '../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import FormikAvailability from './components/FormikAvailability';

const FormikMetadata = ({ t, article, fetchSearchTags, handleSubmit }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      showError
      description={t('form.tags.description')}>
      {({ field, form }) => (
        <AsyncSearchTags
          initialTags={article.tags}
          language={article.language}
          field={field}
          form={form}
          fetchTags={fetchSearchTags}
        />
      )}
    </FormikField>
    <FormikField
      name="availability"
      label={t('form.availability.label')}
      description={t('form.availability.description')}>
      {({ field }) => <FormikAvailability availability={article.availability} field={field} />}
    </FormikField>
    <FormikField
      name="metaDescription"
      maxLength={155}
      showMaxLength
      label={t('form.metaDescription.label')}
      description={t('form.metaDescription.description')}>
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          placeholder={t('form.metaDescription.label')}
          handleSubmit={handleSubmit}
          {...field}
        />
      )}
    </FormikField>
    <FormikField name="metaImageId">
      {({ field, form }) => (
        <FormikMetaImageSearch
          metaImageId={field.value}
          setFieldTouched={form.setFieldTouched}
          showRemoveButton={false}
          {...field}
        />
      )}
    </FormikField>
  </Fragment>
);

FormikMetadata.propTypes = {
  article: PropTypes.shape({
    availability: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
  }).isRequired,
  fetchSearchTags: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default injectT(FormikMetadata);
