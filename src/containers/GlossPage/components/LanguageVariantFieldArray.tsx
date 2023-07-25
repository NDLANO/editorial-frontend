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
          {examples.map((example, exampleIndex) => (
            <>
              <FieldHeader
                title={`${t('form.concept.glossDataSection.language')} ${exampleIndex + 1}`}
              />
              {examples?.length > 1 && (
                <FieldRemoveButton onClick={() => arrayHelpers.remove(exampleIndex)}>
                  {t('form.concept.glossDataSection.remove', {
                    label: `${t('form.concept.glossDataSection.languageVariant').toLowerCase()} ${
                      exampleIndex + 1
                    }`,
                  })}
                </FieldRemoveButton>
              )}

              <ExampleField
                name={`${name}.${exampleIndex}`}
                example={example}
                index={exampleIndex}
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
