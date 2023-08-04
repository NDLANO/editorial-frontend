/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/concept-api';
import { FieldRemoveButton, FieldSplitter } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { FieldArray } from 'formik';
import styled from '@emotion/styled';
import LanguageVariantFieldArray from './LanguageVariantFieldArray';
import FormikField from '../../../components/FormikField';

interface Props {
  name: string;
  examples: IGlossExample[][];
}

const StyledExamplesField = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  &:not(:first-of-type) {
    border-top: 1px solid ${colors.brand.greyLight};
  }

  > :first-child {
    min-width: 75%;
    display: flex;

    > :first-child {
      min-width: 100%;
      margin-top: ${spacing.small};
    }
  }
`;

const ExamplesWrapper = styled.div`
  > :last-child {
    margin-top: ${spacing.small};
  }
`;

const StyledFormikField = styled(FormikField)`
  margin: 0;
`;

const StyledFieldRemoveButton = styled(FieldRemoveButton)`
  padding: 0;
`;

const ExamplesFieldArray = ({ name, examples }: Props) => {
  const { t } = useTranslation();
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers: any) => (
        <ExamplesWrapper>
          {examples.map((languageVariantExamples, index) => (
            <>
              <StyledExamplesField key={`${name}.${index}`}>
                <FieldSplitter>
                  <div>
                    <StyledFormikField name={`${name}.${index}`} showError={false}>
                      {({ field }) => (
                        <LanguageVariantFieldArray
                          examples={languageVariantExamples}
                          {...field}
                          removeFromParentArray={() => arrayHelpers.remove(index)}
                        />
                      )}
                    </StyledFormikField>
                  </div>
                </FieldSplitter>

                <StyledFieldRemoveButton onClick={() => arrayHelpers.remove(index)}>
                  {t('form.concept.glossDataSection.remove', {
                    label: t(`form.concept.glossDataSection.example`).toLowerCase(),
                  })}
                </StyledFieldRemoveButton>
              </StyledExamplesField>
            </>
          ))}
          <ButtonV2
            onClick={() => arrayHelpers.push([{ example: '', language: '', transcriptions: {} }])}
            data-cy="addExample"
          >
            {t('form.concept.glossDataSection.add', {
              label: t(`form.concept.glossDataSection.example`).toLowerCase(),
            })}
          </ButtonV2>
        </ExamplesWrapper>
      )}
    />
  );
};

export default ExamplesFieldArray;
