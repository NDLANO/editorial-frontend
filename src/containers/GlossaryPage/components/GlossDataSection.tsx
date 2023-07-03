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
import TranscriptionsField from './TranscriptionsField';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import Examples from './Examples';
import { WORD_CLASSES, LANGUAGES } from '../glossaryData';

const GlossDataSection = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { glossData } = formikContext.values;
  const { t } = useTranslation();

  if (!glossData) return <></>;
  return (
    <>
      <FieldSection>
        <FormikField name="glossData.gloss">
          {({ field }) => (
            <Input
              label={t('form.concept.glossData.gloss')}
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
              label={t('form.concept.glossData.wordClass')}
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
              <option value="" />
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
              <option value="" />
              {LANGUAGES.map((l, index) => (
                <option value={l} key={index}>
                  {l}
                </option>
              ))}
            </Select>
          )}
        </FormikField>
      </FieldSection>

      {glossData.originalLanguage === 'zh' && (
        <>
          <FieldHeader title={t('form.concept.glossData.transcriptions')} />
          <FormikField name="glossData.transcriptions">
            {({ field }) => <TranscriptionsField values={glossData.transcriptions} {...field} />}
          </FormikField>
        </>
      )}

      <FieldHeader title={t('form.concept.glossData.examples')} />
      <FormikField name="glossData.examples">
        {({ field }) => <Examples label="examples" values={glossData.examples} {...field} />}
      </FormikField>
    </>
  );
};

export default GlossDataSection;
