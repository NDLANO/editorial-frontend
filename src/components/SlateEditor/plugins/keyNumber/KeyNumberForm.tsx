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
import { InputV2, TextArea } from '@ndla/forms';
import { KeyNumberEmbedData } from '@ndla/types-embed';
import { spacing } from '@ndla/core';
import { FieldProps, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import InlineImageSearch from '../../../../containers/ConceptPage/components/InlineImageSearch';
import { supportedLanguages } from '../../../../i18n2';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';

interface Props {
  onSave: (data: KeyNumberEmbedData) => void;
  initialData: KeyNumberEmbedData;
  onCancel: () => void;
}

interface KeyNumberFormValue {
  resource: 'key-number';
  metaImageId: string;
  language: string;
  title: string;
  subTitle: string;
}

const toInitialValues = (initialData: KeyNumberEmbedData): KeyNumberFormValue => ({
  resource: initialData?.resource ?? 'key-number',
  metaImageId: initialData?.imageId ?? '',
  title: initialData?.title ?? '',
  subTitle: initialData?.subTitle ?? '',
  language: initialData?.language ?? 'nb',
});

const rules: RulesType<KeyNumberFormValue> = {
  title: {
    required: true,
  },
  subTitle: {
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

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const KeyNumberForm = ({ onSave, initialData, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: KeyNumberFormValue) => {
      const newData: KeyNumberEmbedData = {
        resource: 'key-number',
        imageId: values.metaImageId,
        title: values.title,
        subTitle: values.subTitle,
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
              <InputV2
                customCss={inputStyle}
                label={t('form.name.title')}
                {...field}
                after={
                  <StyledFormikField name="language">
                    {({ field }: FieldProps) => (
                      <StyledSelect {...field}>
                        {supportedLanguages.map((lang) => (
                          <option key={lang} value={lang}>
                            {t(`languages.${lang}`)}
                          </option>
                        ))}
                      </StyledSelect>
                    )}
                  </StyledFormikField>
                }
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="subTitle" showError>
            {({ field }: FieldProps) => (
              <InputV2 customCss={inputStyle} label={t('form.name.subTitle')} {...field} />
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

export default KeyNumberForm;
