/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/concept-api';
import { FieldRemoveButton, FieldSection } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';

import { useTranslation } from 'react-i18next';
import { FieldArray } from 'formik';
import styled from '@emotion/styled';
import ExampleField from './ExampleField';
import { emptyGlossExample } from '../glossData';

const Wrapper = styled.div`
  margin-bottom: ${spacing.small};
`;

const StyledButton = styled(ButtonV2)`
  margin-top: ${spacing.small};
`;

type Props = {
  name: string;
  examples: IGlossExample[];
  removeFromParentArray: () => void;
};

const LanguageVariantFieldArray = ({ examples, name, removeFromParentArray }: Props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            {examples?.map((example, exampleIndex) => (
              <FieldSection key={exampleIndex}>
                <ExampleField name={`${name}.${exampleIndex}`} example={example} />
                <div>
                  <FieldRemoveButton
                    onClick={() =>
                      examples.length === 1
                        ? removeFromParentArray()
                        : arrayHelpers.remove(exampleIndex)
                    }
                  >
                    {t('form.concept.glossDataSection.remove')}
                  </FieldRemoveButton>
                </div>
              </FieldSection>
            ))}
            <StyledButton variant="outline" onClick={() => arrayHelpers.push(emptyGlossExample)}>
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
