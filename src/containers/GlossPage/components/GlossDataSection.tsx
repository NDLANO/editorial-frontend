/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from 'formik';
import { FieldHeader, FieldSection, Input, Select } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import { WordClass } from '@ndla/ui/lib/model/WordClass';
import { IGlossExample } from '@ndla/types-backend/concept-api';
import FormikField from '../../../components/FormikField';
import ExamplesFieldArray from './ExamplesFieldArray';
import { LANGUAGES } from '../glossData';
import TranscriptionsField from './TranscriptionsField';

const GlossDataSection = () => {
  const [examples] = useField<IGlossExample[][]>('examples');
  const [transcriptions] = useField<{ [key: string]: string }>('transcriptions');
  const [originalLanguage] = useField<string>('originalLanguage');

  const { t } = useTranslation();
  return (
    <>
      <FieldSection>
        <FormikField name="gloss">
          {({ field }) => (
            <Input
              placeholder={t('form.concept.glossDataSection.gloss')}
              type="text"
              value={field.value}
              {...field}
            />
          )}
        </FormikField>
        <FormikField name="wordClass" showError={false}>
          {({ field }) => (
            <Select
              label={t('form.concept.glossDataSection.wordClass')}
              value={field.value}
              {...field}
            >
              {!field.value && (
                <option>
                  {t('form.concept.glossDataSection.choose', {
                    label: t('form.concept.glossDataSection.wordClass').toLowerCase(),
                  })}
                </option>
              )}
              {Object.entries(WordClass)?.map((entry) => (
                <option value={entry[1]} key={entry[0]}>
                  {t(`wordClass.${entry[1]}`)}
                </option>
              ))}
            </Select>
          )}
        </FormikField>
        <FormikField name="originalLanguage">
          {({ field }) => (
            <Select value={field.value} {...field}>
              {!field.value && (
                <option>
                  {t('form.concept.glossDataSection.choose', {
                    label: t('form.concept.glossDataSection.originalLanguage').toLowerCase(),
                  })}
                </option>
              )}

              {LANGUAGES.map((language, index) => (
                <option value={language} key={index}>
                  {t(`languages.${language}`)}
                </option>
              ))}
            </Select>
          )}
        </FormikField>
      </FieldSection>

      {originalLanguage.value === 'zh' && (
        <>
          <FieldHeader title={t('form.concept.glossDataSection.transcriptions')} />
          <TranscriptionsField name="transcriptions" values={transcriptions.value ?? {}} />
        </>
      )}
      <FieldHeader title={t('form.concept.glossDataSection.examples')} />
      <ExamplesFieldArray name="examples" examples={examples.value ?? []} />
    </>
  );
};

export default GlossDataSection;
