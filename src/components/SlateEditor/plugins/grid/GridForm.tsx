/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Formik, FieldProps } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';

interface GridFormValues {
  resource: 'grid';
  size?: 'small' | 'medium' | 'large';
  columns?: 2 | 4;
}

export interface GridEmbedData {
  resource: 'grid';
  size?: 'small' | 'medium' | 'large';
  columns?: 2 | 4;
}

const rules: RulesType<GridFormValues> = {
  columns: {
    required: true,
  },
  size: {
    required: true,
  },
};

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
`;

const toInitialValues = (initialData?: GridEmbedData): GridFormValues => {
  return {
    resource: 'grid',
    size: initialData?.size ?? 'medium',
    columns: initialData?.columns ?? 2,
  };
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

interface Props {
  initialData?: GridEmbedData;
  onSave: (data: GridFormValues) => void;
  onCancel: () => void;
}

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const sizes = ['small', 'medium', 'large'];
const columns = [1, 2];

const GridForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: GridFormValues) => {
      const newData: GridEmbedData = {
        resource: 'grid',
        size: values.size ?? 'medium',
        columns: values.columns ?? 2,
      };

      onSave(newData);
    },
    [onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid, handleSubmit }) => (
        <>
          <StyledFormikField name="size">
            {({ field }: FieldProps) => (
              <StyledSelect {...field} title={t('gridform.size')}>
                {sizes.map((size) => (
                  <option value={size} key={size}>
                    {t(`gridform.sizes.${size}`)}
                  </option>
                ))}
              </StyledSelect>
            )}
          </StyledFormikField>
          <StyledFormikField name="columns">
            {({ field }: FieldProps) => (
              <StyledSelect {...field} title={t('gridform.columns')}>
                {columns.map((column) => (
                  <option value={column} key={column}>
                    {column}
                  </option>
                ))}
              </StyledSelect>
            )}
          </StyledFormikField>
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t('cancel')}
            </ButtonV2>
            <ButtonV2
              variant="solid"
              disabled={!dirty || !isValid}
              type="submit"
              onClick={() => handleSubmit()}
            >
              {t('save')}
            </ButtonV2>
          </ButtonContainer>
        </>
      )}
    </Formik>
  );
};

export default GridForm;
