/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import BEMHelper from 'react-bem-helper';
import { FieldProps, useFormikContext } from 'formik';
import { fetchSearchTags } from '../../../modules/audio/audioApi';
import { LicenseField, ContributorsField } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { AudioFormikType } from './AudioForm';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  classes: BEMHelper<BEMHelper.ReturnObject>;
}

const AudioMetaData = (props: Props) => {
  const {
    values: { language, tags },
  } = useFormikContext<AudioFormikType>();
  const { t } = useTranslation();
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
      <FormikField name="license">{({ field }) => <LicenseField {...field} />}</FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      <ContributorsField contributorTypes={contributorTypes} />
    </>
  );
};

AudioMetaData.propTypes = {
  classes: PropTypes.func.isRequired,
  values: PropTypes.object,
};

export default AudioMetaData;
