/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { FieldInputProps, FieldProps } from 'formik';
import { fetchSearchTags } from '../../../modules/image/imageApi';
import FormikField from '../../../components/FormikField';
import { FormikLicense, FormikContributors } from '../../FormikForm';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
const contributorTypes = ['creators', 'rightsholders', 'processors'];

type LicenseType = { description: string; license: string };

interface Props {
  imageTags: string[];
  licenses: LicenseType[];
  imageLanguage?: string;
}

const ImageMetaData: FC<Props & tType> = ({
  t,
  imageTags,
  licenses,
  imageLanguage,
}) => (
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
        <FormikLicense licenses={licenses} {...field} />
      )}
    </FormikField>
    <FormikField label={t('form.origin.label')} name="origin" />
    <FormikContributors contributorTypes={contributorTypes} />
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
