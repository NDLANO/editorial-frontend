/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/concept-api';
import { ButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { FieldArray, useField } from 'formik';
import styled from '@emotion/styled';
import LanguageVariantFieldArray from './LanguageVariantFieldArray';
import FormikField from '../../../components/FormikField';
import { emptyGlossExample } from '../glossData';

const StyledExamplesField = styled.div`
  &:not(:first-of-type) {
    border-top: 1px solid ${colors.brand.greyLight};
  }
`;

interface Props {
  name: string;
}

const ExamplesFieldArray = ({ name }: Props) => {
  const [_, { value }] = useField<IGlossExample[][]>('examples');
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <>
          {value.map((languageVariantExamples, index) => (
            <StyledExamplesField key={`${name}.${index}`}>
              <FormikField name={`${name}.${index}`} showError={false}>
                {({ field }) => (
                  <LanguageVariantFieldArray
                    examples={languageVariantExamples}
                    {...field}
                    removeFromParentArray={() => arrayHelpers.remove(index)}
                  />
                )}
              </FormikField>
            </StyledExamplesField>
          ))}
          <ButtonV2
            onClick={() => {
              arrayHelpers.push([emptyGlossExample]);
            }}
            data-cy="addExample"
          >
            {t('form.concept.glossDataSection.add', {
              label: t(`form.concept.glossDataSection.example`).toLowerCase(),
            })}
          </ButtonV2>
        </>
      )}
    />
  );
};

export default ExamplesFieldArray;