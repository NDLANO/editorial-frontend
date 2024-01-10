/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { TrashCanOutline } from '@ndla/icons/action';
import { IGlossExample } from '@ndla/types-backend/concept-api';
import { Text } from '@ndla/typography';
import ExampleField from './ExampleField';
import { emptyGlossExample } from '../glossData';

const StyledFieldset = styled.fieldset`
  border: none;
  margin-bottom: ${spacing.small};
  width: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledButton = styled(ButtonV2)`
  align-self: flex-start;
`;

const ExampleWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

type Props = {
  name: string;
  examples: IGlossExample[];
  removeFromParentArray: () => void;
  index: number;
};

const LanguageVariantFieldArray = ({ examples, name, index, removeFromParentArray }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledFieldset>
      <Text element="legend" textStyle="label-large">
        {t('form.gloss.examples.exampleOnIndex', { index: index + 1 })}
      </Text>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            {examples?.map((example, exampleIndex) => (
              <ExampleWrapper key={exampleIndex}>
                <ExampleField
                  name={`${name}.${exampleIndex}`}
                  example={example}
                  index={index}
                  exampleIndex={exampleIndex}
                  onRemoveExample={() =>
                    examples.length === 1
                      ? removeFromParentArray()
                      : arrayHelpers.remove(exampleIndex)
                  }
                />
              </ExampleWrapper>
            ))}
            <StyledButton variant="outline" onClick={() => arrayHelpers.push(emptyGlossExample)}>
              {t('form.gloss.add', {
                label: t(`form.gloss.languageVariant`).toLowerCase(),
              })}
            </StyledButton>
            <StyledButton variant="outline" colorTheme="danger" onClick={removeFromParentArray}>
              <TrashCanOutline />
              {t('form.gloss.examples.remove', { index: index + 1 })}
            </StyledButton>
          </>
        )}
      />
    </StyledFieldset>
  );
};

export default LanguageVariantFieldArray;
