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
import { IGlossData } from '@ndla/types-backend/concept-api';
import FormikField from '../../../components/FormikField';
import ExamplesFieldArray from './ExamplesFieldArray';
import { LANGUAGES } from '../glossData';
import TranscriptionsField from './TranscriptionsField';

const GlossDataSection = () => {
  const [{ value: glossData }] = useField<IGlossData>('glossData');
  const { t } = useTranslation();

  return glossData ? (
    <>
      <FormikField name="glossInfoErrors">
        {() => (
          <FieldSection>
            <FormikField name="glossData.gloss">
              {({ field }) => (
                <Input
                  name={'glossData.gloss'}
                  placeholder={t('form.concept.glossDataSection.gloss')}
                  type="text"
                  value={field.value}
                  {...field}
                />
              )}
            </FormikField>
            <FormikField name="glossData.wordClass">
              {({ field }) => (
                <Select
                  label={t('form.concept.glossDataSection.wordClass')}
                  value={field.value}
                  {...field}
                >
                  {!glossData.wordClass && (
                    <option>
                      {t('form.concept.glossDataSection.choose', {
                        label: t('form.concept.glossDataSection.wordClass').toLowerCase(),
                      })}
                    </option>
                  )}
                  {Object.entries(WordClass).map((entry) => (
                    <option value={entry[1]} key={entry[0]}>
                      {t(`wordClass.${entry[1]}`)}
                    </option>
                  ))}
                </Select>
              )}
            </FormikField>
            <FormikField name="glossData.originalLanguage">
              {({ field }) => (
                <Select value={field.value} {...field}>
                  {!glossData.originalLanguage && (
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
        )}
      </FormikField>

      {glossData.originalLanguage === 'zh' && (
        <FormikField name="glossTranscriptionErrors">
          {() => (
            <>
              <FieldHeader title={t('form.concept.glossDataSection.transcriptions')} />
              <FormikField name="glossData.transcriptions">
                {({ field }) => (
                  <TranscriptionsField values={glossData.transcriptions} {...field} />
                )}
              </FormikField>
            </>
          )}
        </FormikField>
      )}

      <FieldHeader title={t('form.concept.glossDataSection.examples')} />
      <ExamplesFieldArray name="glossData.examples" examples={glossData.examples} />
    </>
  ) : null;
};

export default GlossDataSection;
