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
import FormikField from '../../../components/FormikField';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import ExamplesFieldArray from './ExamplesFieldArray';
import { WORD_CLASSES, LANGUAGES } from '../glossData';
import TranscriptionFieldArray from './TranscriptionFieldArray';

const GlossDataSection = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { glossData } = formikContext.values;
  const { t } = useTranslation();

  if (!glossData) return <></>;
  return (
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
                  onChange={(e) => {
                    field.onChange({
                      target: {
                        name: field.name,
                        value: e.currentTarget.value,
                      },
                    });
                  }}
                />
              )}
            </FormikField>
            <FormikField name="glossData.wordClass">
              {({ field }) => (
                <Select
                  label={t('form.concept.glossDataSection.wordClass')}
                  value={glossData.wordClass}
                  onChange={(e) => {
                    field.onChange({
                      target: {
                        name: field.name,
                        value: e.currentTarget.value,
                      },
                    });
                  }}
                >
                  {!glossData.wordClass && (
                    <option>
                      {t('form.concept.glossDataSection.choose', {
                        label: t('form.concept.glossDataSection.wordClass').toLowerCase(),
                      })}
                    </option>
                  )}
                  {Object.entries(WORD_CLASSES).map((entry) => (
                    <option value={entry[1]} key={entry[0]}>
                      {entry[1]}
                    </option>
                  ))}
                </Select>
              )}
            </FormikField>
            <FormikField name="glossData.originalLanguage">
              {({ field }) => (
                <Select
                  value={glossData.originalLanguage}
                  onChange={(e) => {
                    field.onChange({
                      target: {
                        name: field.name,
                        value: e.currentTarget.value,
                      },
                    });
                  }}
                >
                  {!glossData.originalLanguage && (
                    <option>
                      {t('form.concept.glossDataSection.choose', {
                        label: t('form.concept.glossDataSection.originalLanguage').toLowerCase(),
                      })}
                    </option>
                  )}
                  {LANGUAGES.map((l, index) => (
                    <option value={l} key={index}>
                      {t(`languages.${l}`)}
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
                  <TranscriptionFieldArray values={glossData.transcriptions} {...field} />
                )}
              </FormikField>
            </>
          )}
        </FormikField>
      )}

      <FieldHeader title={t('form.concept.glossDataSection.examples')} />
      <ExamplesFieldArray label="glossData.examples" exampleLists={glossData.examples} />
    </>
  );
};

export default GlossDataSection;
