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
import { FormikMetaImageSearch } from '../../FormikForm';
import { SubjectShape } from '../../../shapes';
import { MultiSelectDropdown } from '../../../components/Dropdown';

const ConceptMetaData = ({ t, subjects, tags }) => (
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
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(ConceptMetaData);
