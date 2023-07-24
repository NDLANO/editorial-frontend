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
import { FieldArray } from 'formik';
import ExampleField from './ExampleField';

type Props = {
  name: string;
  examples: IGlossExample[];
};

const LanguageVariantFieldArray = ({ examples, name }: Props) => {
  const { t } = useTranslation();
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <>
          {examples.map((example, example_index) => (
            <>
              <FieldHeader
                title={`${t('form.concept.glossDataSection.language')} ${example_index + 1}`}
              />
              {examples?.length > 1 && (
                <FieldRemoveButton onClick={() => arrayHelpers.remove(example_index)}>
                  {t('form.concept.glossDataSection.remove', {
                    label: `${t('form.concept.glossDataSection.languageVariant').toLowerCase()} ${
                      example_index + 1
                    }`,
                  })}
                </FieldRemoveButton>
              )}

              <ExampleField
                name={`${name}.${example_index}`}
                example={example}
                index={example_index}
              />
            </>
          ))}
          <ButtonV2
            variant="outline"
            onClick={() => arrayHelpers.push({ example: '', language: '', transcriptions: {} })}
          >
            {t('form.concept.glossDataSection.add', {
              label: t(`form.concept.glossDataSection.languageVariant`).toLowerCase(),
            })}
          </ButtonV2>
        </>
      )}
    />
  );
};

export default LanguageVariantFieldArray;
