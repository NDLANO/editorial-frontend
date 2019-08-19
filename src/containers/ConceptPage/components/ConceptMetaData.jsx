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

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ConceptMetaData = ({ t, licenses, subjects, tags }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      description={t('form.tags.description')}
      obligatory>
      {({ field }) => (
        <MultiSelectDropdown showCreateOption {...field} data={tags} />
      )}
    </FormikField>
    <FormikField name="license">
      {({ field }) => (
        <FormikLicense licenses={licenses} width={1} {...field} />
      )}
    </FormikField>
    <FormikField label={t('form.origin.label')} name="origin" />
    <FormikContributors contributorTypes={contributorTypes} width={1} />
    <FormikField name="metaImageId">
      {({ field }) => (
        <FormikMetaImageSearch metaImageId={field.value} {...field} />
      )}
    </FormikField>
    <FormikField name="subjects" label={t('form.subjects.label')} obligatory>
      {({ field }) => (
        <MultiSelectDropdown
          idField="id"
          labelField="name"
          data={subjects}
          {...field}
        />
      )}
    </FormikField>
  </Fragment>
);

ConceptMetaData.propTypes = {
  licenses: LicensesArrayOf.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(ConceptMetaData);
