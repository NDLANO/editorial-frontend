/**
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
import {
  FormikLicense,
  FormikContributors,
  FormikMetaImageSearch,
} from '../../FormikForm';
import { LicensesArrayOf, SubjectShape } from '../../../shapes';
import { MultiSelectDropdown } from '../../../components/Dropdown';
import ConceptMetaDataArticle from './ConceptMetaDataArticle';

const contributorTypes = ['creators'];

const ConceptMetaData = ({ t, licenses, subjects, tags, locale }) => (
  <Fragment>
    <FormikField name="license">
      {({ field }) => (
        <FormikLicense licenses={licenses} width={1} {...field} />
      )}
    </FormikField>
    <FormikField label={t('form.concept.source')} name="source" />
    <FormikContributors contributorTypes={contributorTypes} width={1} />
    <FormikField name="metaImageId">
      {({ field }) => (
        <FormikMetaImageSearch metaImageId={field.value} {...field} />
      )}
    </FormikField>
    <FormikField name="subjects" label={t('form.subjects.label')}>
      {({ field }) => (
        <MultiSelectDropdown
          idField="id"
          labelField="name"
          data={subjects}
          {...field}
        />
      )}
    </FormikField>
    <FormikField name="tags" label={t('form.tags.label')}>
      {({ field }) => (
        <MultiSelectDropdown showCreateOption {...field} data={tags} />
      )}
    </FormikField>

    <ConceptMetaDataArticle locale={locale} t={t} />
  </Fragment>
);

ConceptMetaData.propTypes = {
  licenses: LicensesArrayOf.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(ConceptMetaData);
