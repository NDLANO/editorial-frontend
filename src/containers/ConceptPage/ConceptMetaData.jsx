/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import FormikField from '../../components/FormikField';
import {
  FormikLicense,
  FormikContributors,
  FormikMetaImageSearch,
} from '../FormikForm';
import { LicensesArrayOf } from '../../shapes';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ConceptMetaData = ({ t, licenses }) => (
  <Fragment>
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
  </Fragment>
);

ConceptMetaData.propTypes = {
  licenses: LicensesArrayOf.isRequired,
};

export default injectT(ConceptMetaData);
