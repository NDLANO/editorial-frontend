/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import { FieldHeader, FieldRemoveButton } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';
import Example from './Example';

type Props = {
  examples: IGlossExample[];
  index: number;
  arrayHelpers: any;
};

const LanguageVariant = ({ examples, index, arrayHelpers }: Props) => {
  const { t } = useTranslation();

  const addLanguageVariant = () => {
    const newLanguageVariants = examples;
    newLanguageVariants.push({ example: '', language: '', transcriptions: {} });
    arrayHelpers.swap(newLanguageVariants);
  };

  const removeLanguageVariant = (example_index: number) => {
    const newLanguageVariants = examples;
    newLanguageVariants.splice(example_index, 1);
    arrayHelpers.swap(newLanguageVariants);
  };

  const handleLanguageVariantChange = (
    new_example_language: IGlossExample,
    language_index: number,
  ) => {
    const newLanguageVariants = examples;
    newLanguageVariants[language_index] = new_example_language;
    arrayHelpers.swap(newLanguageVariants);
  };

  return (
    <FormikField name={`glossData.examples.${index}`}>
      {() => (
        <>
          {examples.map((example, example_index) => (
            <>
              <FieldHeader
                title={`${t('form.concept.glossDataSection.language')} ${example_index + 1}`}
              />
              <FormikField name={`glossData.examples.${index}.${example_index}`}>
                {({ field }) => (
                  <Example
                    example={example}
                    index={example_index}
                    handleLanguageVariantChange={handleLanguageVariantChange}
                    {...field}
                  />
                )}
              </FormikField>

              {examples && examples.length > 1 && (
                <FieldRemoveButton onClick={() => removeLanguageVariant(example_index)}>
                  {t('form.concept.glossDataSection.remove', {
                    label: t(`form.concept.glossDataSection.languageVariant`).toLowerCase(),
                  })}
                </FieldRemoveButton>
              )}
            </>
          ))}
          <ButtonV2 variant="outline" onClick={() => addLanguageVariant()}>
            {t('form.concept.glossDataSection.add', {
              label: t(`form.concept.glossDataSection.languageVariant`).toLowerCase(),
            })}
          </ButtonV2>
        </>
      )}
    </FormikField>
  );
};

export default LanguageVariant;
