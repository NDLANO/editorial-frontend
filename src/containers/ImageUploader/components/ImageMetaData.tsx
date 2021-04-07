/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { FieldInputProps, FieldProps } from 'formik';
import { fetchSearchTags } from '../../../modules/image/imageApi';
import FormikField from '../../../components/FormikField';
import { LicenseField, ContributorsField } from '../../FormikForm';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { ImageApiLicense } from '../../../modules/image/imageApiInterfaces';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  imageTags: string[];
  licenses: ImageApiLicense[];
  imageLanguage?: string;
}

const ImageMetaData = ({ t, imageTags, licenses, imageLanguage }: Props & tType) => (
  <Fragment>
    <FormikField
      name="tags"
      label={t('form.tags.label')}
      obligatory
      description={t('form.tags.description')}>
      {({ field, form }: FieldProps<string[], string[]>) => (
        <AsyncSearchTags
          language={imageLanguage || 'all'}
          initialTags={imageTags}
          field={field}
          form={form}
          fetchTags={fetchSearchTags}
        />
      )}
    </FormikField>
    <FormikField name="license">
      {({ field }: { field: FieldInputProps<string> }) => (
        <LicenseField licenses={licenses} {...field} />
      )}
    </FormikField>
    <FormikField label={t('form.origin.label')} name="origin" />
    <ContributorsField contributorTypes={contributorTypes} />
  </Fragment>
);

ImageMetaData.propTypes = {
  imageTags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      license: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  imageLanguage: PropTypes.string,
};

export default injectT(ImageMetaData);
