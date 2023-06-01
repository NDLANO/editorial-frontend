/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { RadioButtonGroup, GridType } from '@ndla/ui';
import { Formik, FieldProps } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';

interface GridFormValues {
  columns: GridType['columns'];
  border: GridType['border'];
}

const rules: RulesType<GridFormValues> = {
  columns: {
    required: true,
  },
  border: {
    required: true,
  },
};

const toInitialValues = (initialData?: GridType): GridFormValues => {
  return {
    columns: initialData?.columns ?? 2,
    border: initialData?.border ?? 'none',
  };
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

interface Props {
  initialData?: GridType;
  onSave: (data: GridFormValues) => void;
  onCancel: () => void;
}

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const columns: GridType['columns'][] = [2, 4];
const border: GridType['border'][] = ['none', 'lightBlue'];

const GridForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: GridFormValues) => {
      const newData: GridType = {
        columns: values.columns,
        border: values.border,
      };
      onSave(newData);
    },
    [onSave],
  );

  const columnsOptions = useMemo(
    () =>
      columns.map((value) => ({
        title: value.toString(),
        value: value.toString(),
      })),
    [],
  );

  const borderOption = useMemo(
    () =>
      border.map((value) => ({
        title: value,
        value: value,
      })),
    [],
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
          <StyledFormikField name="columns">
            {({ field }: FieldProps) => (
              <RadioButtonGroup
                label={t('form.name.columns')}
                selected={field.value.toString() ?? '2'}
                uniqeIds
                options={columnsOptions}
                onChange={(value: string) =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: value.toString(),
                    },
                  })
                }
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="border">
            {({ field }: FieldProps) => (
              <RadioButtonGroup
                label={t('form.name.border')}
                selected={field.value ?? 'none'}
                uniqeIds
                options={borderOption}
                onChange={(value: string) =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: value,
                    },
                  })
                }
              />
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
