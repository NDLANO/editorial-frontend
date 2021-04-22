/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { injectT, tType } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { FieldProps, useFormikContext } from 'formik';
import { fetchSearchTags } from '../../../modules/audio/audioApi';
// TODO!!! Remove import { fetchSearchTags } from '../../../modules/draft/draftApi';
import { LicenseField, ContributorsField } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { License } from '../../../interfaces';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface BaseProps {
  classes: BEMHelper<BEMHelper.ReturnObject>;
  licenses: License[];
  // TODO!!! Remove
  // audioLanguage: string;
  // audioTags: string[];
}

type Props = BaseProps & tType;

const AudioMetaData = (props: Props) => {
  const {
    values: { language, tags },
  } = useFormikContext();
  const { t, licenses } = props;
  return (
    <>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        obligatory
        description={t('form.tags.description')}>
        {({ field, form }: FieldProps<string[], string[]>) => (
          <AsyncSearchTags
            language={language}
            initialTags={tags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      <FormikField name="license">
        {({ field }) => <LicenseField licenses={licenses} {...field} />}
      </FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      <ContributorsField contributorTypes={contributorTypes} />
    </>
  );
};

AudioMetaData.propTypes = {
  classes: PropTypes.func.isRequired,
  values: PropTypes.object,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      license: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  // TODO!!! Remove
  // audioLanguage: PropTypes.string.isRequired,
  // audioTags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default injectT(AudioMetaData);
