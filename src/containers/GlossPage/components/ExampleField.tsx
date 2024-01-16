/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Select, InputV3, FieldErrorMessage, Label } from '@ndla/forms';
import { Cross } from '@ndla/icons/action';
import { IGlossExample } from '@ndla/types-backend/concept-api';
import { Text } from '@ndla/typography';
import { FormControl, FormField } from '../../../components/FormField';
import { LANGUAGES } from '../glossData';

interface Props {
  example: IGlossExample;
  name: string;
  index: number;
  exampleIndex: number;
  onRemoveExample: () => void;
}

const Wrapper = styled.fieldset`
  width: 100%;
  border: none;
  padding: 0px;
  margin: 0px;
`;

const FieldWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  width: 100%;
`;

const StyledFormControl = styled(FormControl)`
  flex: 1;
`;

const RemoveButton = styled(IconButtonV2)`
  height: ${spacing.large};
  width: ${spacing.large};
`;

const ExampleField = ({ example, name, index, exampleIndex, onRemoveExample }: Props) => {
  const { t } = useTranslation();
  const labelIndex = index + 1;
  const [languageField, languageMeta, languageHelpers] = useField(`${name}.language`);
  const [originalLanguageField] = useField('gloss.originalLanguage');

  const removeLabel = t('form.gloss.examples.removeLanguageVariant', {
    language: t(`languages.${example.language}`).toLowerCase(),
    index: exampleIndex + 1,
  });

  useEffect(() => {
    if (exampleIndex === 0) {
      languageHelpers.setValue(originalLanguageField.value, true);
    } else if (!languageField.value) {
      languageHelpers.setValue('nb', true);
    }
  }, [exampleIndex, languageField.value, languageHelpers, originalLanguageField.value]);

  return (
    <Wrapper>
      <Text element="legend" textStyle="label-small">
        {t('form.gloss.examples.exampleOnLanguage', {
          index: labelIndex,
          language: t(`languages.${languageField.value}`).toLowerCase(),
        })}
      </Text>
      <FieldWrapper>
        <FormField name={`${name}.example`}>
          {({ field, meta }) => (
            <StyledFormControl isRequired isInvalid={!!meta.error}>
              <Label textStyle="label-small" margin="none" visuallyHidden>
                {t('form.gloss.examples.exampleTextLabel', {
                  index: labelIndex,
                  language: t(`languages.${languageField.value}`).toLowerCase(),
                })}
              </Label>
              <InputV3 type="text" placeholder={t('form.gloss.example')} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </StyledFormControl>
          )}
        </FormField>
        <FormControl isRequired isDisabled={exampleIndex === 0} isInvalid={!!languageMeta.error}>
          <Select {...languageField}>
            {!example.language && (
              <option>
                {t('form.gloss.choose', {
                  label: t('form.gloss.language').toLowerCase(),
                })}
              </option>
            )}
            {LANGUAGES.map((language, languageIndex) => (
              <option value={language} key={languageIndex}>
                {t(`languages.${language}`)}
              </option>
            ))}
          </Select>
          <FieldErrorMessage>{languageMeta.error}</FieldErrorMessage>
        </FormControl>
        <RemoveButton
          colorTheme="light"
          aria-label={removeLabel}
          title={removeLabel}
          onClick={onRemoveExample}
        >
          <Cross />
        </RemoveButton>
      </FieldWrapper>
    </Wrapper>
  );
};

export default ExampleField;
