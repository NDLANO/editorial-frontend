/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from 'formik';
import styled from '@emotion/styled';
import { FieldHeader, FieldSection, Input, Select } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { constants } from '@ndla/ui';
import { IGlossData } from '@ndla/types-backend/concept-api';
import FormikField from '../../../components/FormikField';
import ExamplesFieldArray from './ExamplesFieldArray';
import { LANGUAGES } from '../glossData';
import TranscriptionsField from './TranscriptionsField';

const StyledFormikField = styled(FormikField)`
  margin-top: 0px;
`;

const GlossDataSection = () => {
  const [_, { value }] = useField<IGlossData>('gloss');
  const { t } = useTranslation();

  const {
    WordClass: { WordClass },
  } = constants;

  return (
    <>
      <FieldHeader title={t('form.concept.glossDataSection.glossHeading')} />
      <FormikField name="gloss">
        {({ field }) => (
          <FieldSection>
            <StyledFormikField name={`${field.name}.gloss`}>
              {({ field }) => (
                <Input
                  placeholder={t('form.concept.glossDataSection.gloss')}
                  type="text"
                  value={field.value}
                  {...field}
                />
              )}
            </StyledFormikField>
            <StyledFormikField name={`${field.name}.wordClass`}>
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
                  {Object.entries(WordClass)?.map(([key, value]) => (
                    <option value={value} key={key}>
                      {t(`wordClass.${value}`)}
                    </option>
                  ))}
                </Select>
              )}
            </StyledFormikField>
            <StyledFormikField name={`${field.name}.originalLanguage`}>
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
            </StyledFormikField>
          </FieldSection>
        )}
      </FormikField>

      {value?.originalLanguage === 'zh' && (
        <>
          <FieldHeader title={t('form.concept.glossDataSection.transcriptions')} />
          <TranscriptionsField name="transcriptions" />
        </>
      )}
      <FieldHeader title={t('form.concept.glossDataSection.examples')} />
      <ExamplesFieldArray name="examples" />
    </>
  );
};

export default GlossDataSection;
