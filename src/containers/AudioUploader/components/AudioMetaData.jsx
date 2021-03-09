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
import { fetchSearchTags } from '../../../modules/draft/draftApi';
import { LicenseForm, ContributorsForm } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const AudioMetaData = props => {
  const { t, licenses, audioLanguage, audioTags } = props;
  return (
    <Fragment>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        obligatory
        description={t('form.tags.description')}>
        {({ field, form }) => (
          <AsyncSearchTags
            language={audioLanguage}
            initialTags={audioTags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      <FormikField name="license">
        {({ field }) => <LicenseForm licenses={licenses} {...field} />}
      </FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      <ContributorsForm contributorTypes={contributorTypes} />
    </Fragment>
  );
};

AudioMetaData.propTypes = {
  classes: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  audioLanguage: PropTypes.string,
  audioTags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(AudioMetaData);
