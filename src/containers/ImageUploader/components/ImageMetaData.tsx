/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from '@ndla/ui';
import { fetchSearchTags } from '../../../modules/image/imageApi';
import { LicenseField } from '../../FormikForm';
import ContributorsField from '../../Form/ContributorsField';
import FormField from '../../../components/Form';
import { ImageFormType } from '../imageTransformers';
import AsyncSearchTags from '../../Form/AsyncSearchTags';
import { ContributorType } from '../../../interfaces';

const contributorTypes: ContributorType[] = ['creators', 'rightsholders', 'processors'];

interface Props {
  imageLanguage?: string;
}

const ImageMetaData = ({ imageLanguage }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormField<ImageFormType, 'tags'>
        name="tags"
        label={t('form.tags.label')}
        obligatory
        description={t('form.tags.description')}>
        {({ value, onChange }) => (
          <AsyncSearchTags
            language={imageLanguage || 'all'}
            initialTags={value}
            onChange={onChange}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormField>
      <FormField<ImageFormType, 'license'> name="license">
        {({ onChange, onBlur, name, value }) => (
          <LicenseField onChange={onChange} onBlur={onBlur} name={name} value={value} />
        )}
      </FormField>
      <FormField<ImageFormType, 'origin'> label={t('form.origin.label')} name="origin">
        {({ value, onChange, onBlur }) => (
          <input value={value} onChange={onChange} onBlur={onBlur} />
        )}
      </FormField>
      <ContributorsField contributorTypes={contributorTypes} />

      <FormField<ImageFormType, 'modelReleased'>
        name="modelReleased"
        label={t('form.modelReleased.label')}
        description={t('form.modelReleased.description')}>
        {({ value, onChange }) => {
          const options = ['yes', 'not-applicable', 'no', 'not-set'];
          const defaultValue = 'not-set';
          return (
            <>
              <RadioButtonGroup
                selected={value ?? defaultValue}
                uniqeIds
                options={options.map(value => ({ title: t(`form.modelReleased.${value}`), value }))}
                onChange={(value: string) => onChange(value)}
              />
            </>
          );
        }}
      </FormField>
    </>
  );
};

export default ImageMetaData;
