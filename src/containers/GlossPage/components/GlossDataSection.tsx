/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import { FieldHeader, FieldSection, Input, Select } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import { WordClass } from '@ndla/ui/lib/model/WordClass';
import FormikField from '../../../components/FormikField';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import ExamplesFieldArray from './ExamplesFieldArray';
import { LANGUAGES } from '../glossData';
import TranscriptionsField from './TranscriptionsField';
const GlossDataSection = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { glossData } = formikContext.values;
  const { t } = useTranslation();

  return glossData ? (
    <>
      <FormikField name="glossInfoErrors">
        {() => (
          <FieldSection>
            <FormikField name="glossData.gloss">
              {({ field }) => (
                <Input
                  placeholder={t('form.concept.glossDataSection.gloss')}
                  type="text"
                  value={glossData.gloss}
                  {...field}
                />
              )}
            </FormikField>
            <FormikField name="glossData.wordClass">
              {({ field }) => (
                <Select
                  label={t('form.concept.glossDataSection.wordClass')}
                  value={glossData.wordClass}
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
                <Select value={glossData.originalLanguage} {...field}>
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
      <ExamplesFieldArray name="glossData.examples" examplesLists={glossData.examples} />
    </>
  ) : null;
};

export default GlossDataSection;
