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
import {
  FormikLicense,
  FormikContributors,
  FormikMetaImageSearch,
} from '../../FormikForm';
import { LicensesArrayOf, SubjectShape } from '../../../shapes';
import { MultiSelectDropdown } from '../../../components/Dropdown';

const contributorTypes = ['creators'];

const ConceptMetaData = ({ t, licenses, subjects, tags }) => (
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
  </Fragment>
);

ConceptMetaData.propTypes = {
  licenses: LicensesArrayOf.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default injectT(ConceptMetaData);
