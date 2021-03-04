/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { useFormikContext } from 'formik';
import { fetchSearchTags } from '../../../modules/draft/draftApi';
import { FormikLicense, FormikContributors } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const AudioMetaData = props => {
  const { values } = useFormikContext();
  const { t, licenses } = props;

  return (
    <>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        obligatory
        description={t('form.tags.description')}>
        {({ field, form }) => (
          <AsyncSearchTags
            language={values.language}
            initialTags={values.tags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      <FormikField name="license">
        {({ field }) => <FormikLicense licenses={licenses} {...field} />}
      </FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      <FormikContributors contributorTypes={contributorTypes} />
    </>
  );
};

AudioMetaData.propTypes = {
  classes: PropTypes.func.isRequired,
  values: PropTypes.object,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(AudioMetaData);
