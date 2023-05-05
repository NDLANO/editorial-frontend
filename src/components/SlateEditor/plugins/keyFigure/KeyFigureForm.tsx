/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { InputV2 } from '@ndla/forms';
import { KeyFigureEmbedData } from '@ndla/types-embed';
import { spacing } from '@ndla/core';
import { FieldProps, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import InlineImageSearch from '../../../../containers/ConceptPage/components/InlineImageSearch';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import { TYPE_KEY_FIGURE } from './types';

interface Props {
  onSave: (data: KeyFigureEmbedData) => void;
  initialData: KeyFigureEmbedData;
  onCancel: () => void;
}

interface KeyFigureFormValue {
  resource: 'key-figure';
  metaImageId: string;
  language: string;
  title: string;
  subtitle: string;
}

const toInitialValues = (initialData: KeyFigureEmbedData): KeyFigureFormValue => ({
  resource: TYPE_KEY_FIGURE,
  metaImageId: initialData?.imageId ?? '',
  title: initialData?.title ?? '',
  subtitle: initialData?.subtitle ?? '',
  language: initialData?.language ?? 'nb',
});

const rules: RulesType<KeyFigureFormValue> = {
  title: {
    required: true,
  },
  subtitle: {
    required: true,
  },
  language: {
    required: true,
  },
};

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const inputStyle = css`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const KeyFigureForm = ({ onSave, initialData, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: KeyFigureFormValue) => {
      const newData: KeyFigureEmbedData = {
        resource: TYPE_KEY_FIGURE,
        imageId: values.metaImageId,
        title: values.title,
        subtitle: values.subtitle,
        language: values.language,
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
          <StyledFormikField name="title" showError>
            {({ field }: FieldProps) => (
              <InputV2 customCss={inputStyle} label={t('form.name.title')} {...field} />
            )}
          </StyledFormikField>
          <StyledFormikField name="subtitle" showError>
            {({ field }: FieldProps) => (
              <InputV2 customCss={inputStyle} label={t('form.name.subtitle')} {...field} />
            )}
          </StyledFormikField>
          <InlineImageSearch name={'metaImageId'} />
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

export default KeyFigureForm;
