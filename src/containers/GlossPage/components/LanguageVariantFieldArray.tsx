/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/concept-api';
import { FieldRemoveButton } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';

import { useTranslation } from 'react-i18next';
import { FieldArray } from 'formik';
import styled from '@emotion/styled';
import ExampleField from './ExampleField';

type Props = {
  name: string;
  examples: IGlossExample[];
  removeFromParentArray: () => void;
};

const StyledLanguageVariantField = styled.div`
  display: flex;
  min-width: 100%;
  align-items: center;

  > :second-child {
    display: flex;
    justify-content: center;
  }

  > :last-child {
    margin: ${spacing.small} 0 !important;
    flex-grow: 1;
  }
`;

const Wrapper = styled.div`
  margin-bottom: ${spacing.small};
`;

const StyledButton = styled(ButtonV2)`
  margin-top: ${spacing.small};
`;

const LanguageVariantFieldArray = ({ examples, name, removeFromParentArray }: Props) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            {examples.map((example, exampleIndex) => (
              <StyledLanguageVariantField key={exampleIndex}>
                <FieldRemoveButton
                  onClick={() =>
                    examples.length === 1
                      ? removeFromParentArray()
                      : arrayHelpers.remove(exampleIndex)
                  }
                />
                <ExampleField
                  name={`${name}.${exampleIndex}`}
                  example={example}
                  index={exampleIndex}
                />
              </StyledLanguageVariantField>
            ))}
            <StyledButton
              variant="outline"
              onClick={() => arrayHelpers.push({ example: '', language: '', transcriptions: {} })}
            >
              {t('form.concept.glossDataSection.add', {
                label: t(`form.concept.glossDataSection.languageVariant`).toLowerCase(),
              })}
            </StyledButton>
          </>
        )}
      />
    </Wrapper>
  );
};

export default LanguageVariantFieldArray;
