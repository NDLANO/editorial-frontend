/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from '@ndla/ui';
import { FieldInputProps, FieldProps } from 'formik';
import { fetchSearchTags } from '../../../modules/image/imageApi';
import FormikField from '../../../components/FormikField';
import { LicenseField, ContributorsField } from '../../FormikForm';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  imageTags: string[];
  imageLanguage?: string;
}

const ImageMetaData = ({ imageTags, imageLanguage }: Props) => {
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
            language={imageLanguage || 'all'}
            initialTags={imageTags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      <FormikField name="license">
        {({ field }: { field: FieldInputProps<string> }) => <LicenseField {...field} />}
      </FormikField>
      <FormikField label={t('form.origin.label')} name="origin" />
      <ContributorsField contributorTypes={contributorTypes} />

      <FormikField
        name="modelReleased"
        label={t('form.modelReleased.label')}
        description={t('form.modelReleased.description')}>
        {({ field }: { field: FieldInputProps<string> }) => {
          const options = ['yes', 'not-applicable', 'no', 'not-set'];
          const defaultValue = 'not-set';
          return (
            <>
              <RadioButtonGroup
                selected={field.value ?? defaultValue}
                uniqeIds
                options={options.map(value => ({ title: t(`form.modelReleased.${value}`), value }))}
                onChange={(value: string) =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: value,
                    },
                  })
                }
              />
            </>
          );
        }}
      </FormikField>
    </>
  );
};

ImageMetaData.propTypes = {
  imageTags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  imageLanguage: PropTypes.string,
};

export default ImageMetaData;
