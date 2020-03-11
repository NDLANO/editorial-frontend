/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import FormikField from '../../../components/FormikField';
import { FormikMetaImageSearch } from '../../FormikForm';
import { SubjectShape, ConceptShape } from '../../../shapes';
import { MultiSelectDropdown } from '../../../components/Dropdown';
import ConceptMetaDataArticle from './ConceptMetaDataArticle';
import ConceptTags from './ConceptTags';

const ConceptMetaData = ({ t, subjects, locale, concept }) => (
  <Fragment>
    <FormikField name="metaImageId">
      {({ field, form }) => (
        <FormikMetaImageSearch
          metaImageId={field.value}
          setFieldTouched={form.setFieldTouched}
          {...field}
        />
      )}
    </FormikField>
    <FormikField name="subjects" label={t('form.subjects.label')}>
      {({ field }) => (
        <MultiSelectDropdown
          idField="id"
          labelField="name"
          minSearchLength={1}
          data={subjects}
          {...field}
        />
      )}
    </FormikField>
    <FormikField name="tags" label={t('form.tags.label')}>
      {({ field, form }) => (
        <ConceptTags
          locale={locale}
          concept={concept}
          field={field}
          form={form}
        />
      )}
    </FormikField>
    <FormikField name="articleId">
      {({ field }) => (
        <ConceptMetaDataArticle
          locale={locale}
          t={t}
          field={field}
          articleId={concept.articleId}
        />
      )}
    </FormikField>
  </Fragment>
);

ConceptMetaData.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  locale: PropTypes.string.isRequired,
  concept: ConceptShape.isRequired,
};

export default injectT(ConceptMetaData);
