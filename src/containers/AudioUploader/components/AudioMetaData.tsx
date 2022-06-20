/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FieldProps, useFormikContext } from 'formik';
import { fetchSearchTags } from '../../../modules/audio/audioApi';
import { LicenseField, ContributorsField } from '../../FormikForm';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { AudioFormikType } from './AudioForm';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const AudioMetaData = () => {
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
            multiSelect
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

export default AudioMetaData;
