/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FieldErrorMessage, InputV3, Label, Select } from '@ndla/forms';
import { Text } from '@ndla/typography';
import { constants } from '@ndla/ui';
import ExamplesFieldArray from './ExamplesFieldArray';
import { GlossAudioField } from './GlossAudioField';
import TranscriptionsField from './TranscriptionsField';
import { FormControl, FormField } from '../../../components/FormField';
import { LANGUAGES } from '../glossData';

const {
  wordClass: { wordClass },
} = constants;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.small};
`;

const StyledFormControl = styled(FormControl)`
  width: 80%;
`;

const FieldWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

interface Props {
  glossLanguage: string;
}

const GlossDataSection = ({ glossLanguage }: Props) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Text element="h4" textStyle="label-large" margin="none">
        {t('form.gloss.glossHeading')}
      </Text>
      <FieldWrapper>
        <FormField name="gloss.originalLanguage">
          {({ field, meta }) => (
            <FormControl isRequired isInvalid={!!meta.error}>
              <Label visuallyHidden>{t('form.gloss.originalLanguage')}</Label>
              <Select {...field}>
                {!field.value && (
                  <option>
                    {t('form.gloss.choose', {
                      label: t('form.gloss.originalLanguage').toLowerCase(),
                    })}
                  </option>
                )}
                {LANGUAGES.map((language, index) => (
                  <option value={language} key={index}>
                    {t(`languages.${language}`)}
                  </option>
                ))}
              </Select>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
        <FormField name="gloss.wordClass">
          {({ field, meta }) => (
            <FormControl isRequired isInvalid={!!meta.error}>
              <Label visuallyHidden>{t('form.gloss.wordClass')}</Label>
              <Select {...field}>
                {!field.value && (
                  <option>
                    {t('form.gloss.choose', {
                      label: t('form.gloss.wordClass').toLowerCase(),
                    })}
                  </option>
                )}
                {Object.entries(wordClass)?.map(([key, value]) => (
                  <option value={value} key={key}>
                    {t(`wordClass.${value}`)}
                  </option>
                ))}
              </Select>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
      </FieldWrapper>
      <FormField name="gloss.gloss">
        {({ field, meta }) => (
          <StyledFormControl isRequired isInvalid={!!meta.error}>
            <Label textStyle="label-small" margin="none">
              {t('form.gloss.gloss')}
            </Label>
            <InputV3 {...field} placeholder={t('form.gloss.gloss')} type="text" />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </StyledFormControl>
        )}
      </FormField>
      <TranscriptionsField name="transcriptions" />
      <FormField name="visualElement">
        {({ field, meta }) => (
          <FormControl isInvalid={!!meta.error}>
            <Text textStyle="label-small" margin="none">
              {t('form.name.audioFile')}
            </Text>
            <Text margin="small" textStyle="meta-text-medium">
              {t('form.gloss.audio.helperText')}
            </Text>
            <GlossAudioField
              glossLanguage={glossLanguage}
              element={field.value[0]?.data}
              onElementChange={(data) => {
                field.onChange({
                  target: {
                    name: 'visualElement',
                    value: [{ children: [{ text: '' }], data, type: 'audio' }],
                  },
                });
              }}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FormControl>
        )}
      </FormField>
      <ExamplesFieldArray name="examples" />
    </Wrapper>
  );
};

export default GlossDataSection;
