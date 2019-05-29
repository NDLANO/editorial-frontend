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
import FormikField from '../../../components/FormikField';
import { FormikLicense, FormikContributors } from '../../FormikForm';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ImageMetaData = ({ t, tags, licenses }) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      obligatory
      description={t('form.tags.description')}>
      {({ field }) => <MultiSelectDropdown data={tags} {...field} />}
    </FormikField>
    <FormikField name="license">
      {({ field }) => <FormikLicense licenses={licenses} {...field} />}
    </FormikField>
    <FormikField label={t('form.origin.label')} name="origin" />
    <FormikContributors contributorTypes={contributorTypes} />
  </Fragment>
);

ImageMetaData.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(ImageMetaData);
