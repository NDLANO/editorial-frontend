/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HeadingLevel } from '@ndla/ui';
import { CampaignBlockEmbedData } from '@ndla/types-embed';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { FieldProps, Formik } from 'formik';
import { css } from '@emotion/react';
import { InputV2, TextAreaV2 } from '@ndla/forms';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import { supportedLanguages } from '../../../../i18n2';
import FormikField from '../../../FormikField';
import CampaignBlockImagePicker from './CampaignBlockImagePicker';

interface Props {
  initialData?: CampaignBlockEmbedData;
  onSave: (data: CampaignBlockEmbedData) => void;
  onCancel: () => void;
}

export interface CampaignBlockFormValues {
  resource: 'campaign-block';
  title: string;
  titleLanguage: string;
  description: string;
  descriptionLanguage: string;
  headingLevel: HeadingLevel;
  link: string;
  linkText: string;
  imageBeforeId?: string;
  imageAfterId?: string;
}

const rules: RulesType<CampaignBlockFormValues> = {
  title: {
    required: true,
  },
  titleLanguage: {
    required: true,
  },
  description: {
    required: true,
  },
  descriptionLanguage: {
    required: true,
  },
  headingLevel: {
    required: true,
  },
  link: {
    required: true,
    url: true,
  },
  linkText: {
    required: true,
  },
};

const toInitialValues = (
  lang: string,
  initialData?: CampaignBlockEmbedData,
): CampaignBlockFormValues => {
  return {
    resource: 'campaign-block',
    title: initialData?.title ?? '',
    titleLanguage: initialData?.titleLanguage ?? lang,
    description: initialData?.description ?? '',
    descriptionLanguage: initialData?.descriptionLanguage ?? lang,
    imageBeforeId: initialData?.imageBeforeId,
    imageAfterId: initialData?.imageAfterId,
    headingLevel: initialData?.headingLevel ?? 'h2',
    link: initialData?.url ?? '',
    linkText: initialData?.urlText ?? '',
  };
};

const inputStyle = css`
  display: flex;
  flex-direction: column;
`;

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const StyledUrlFormikField = styled(FormikField)`
  margin: 0px;
  flex: 1;
`;

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
`;

const ButtonContainer = styled.div`
  padding-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const UrlWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const CampaignBlockForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t, i18n } = useTranslation();
  const initialValues = useMemo(
    () => toInitialValues(i18n.language, initialData),
    [initialData, i18n.language],
  );
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: CampaignBlockFormValues) => {
      const { link, linkText, ...rest } = values;
      onSave({
        ...rest,
        url: link,
        urlText: linkText,
      });
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
                  <StyledFormikField name="titleLanguage">
                    {({ field }: FieldProps) => (
                      <StyledSelect {...field} title={t('blogPostForm.languageExplanation')}>
                        {supportedLanguages.map((lang) => (
                          <option value={lang} key={lang}>
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
          <StyledFormikField name="description" showError>
            {({ field }: FieldProps) => (
              <TextAreaV2
                customCss={inputStyle}
                label={t('form.name.description')}
                {...field}
                after={
                  <StyledFormikField name="descriptionLanguage">
                    {({ field }: FieldProps) => (
                      <StyledSelect {...field} title={t('blogPostForm.languageExplanation')}>
                        {supportedLanguages.map((lang) => (
                          <option value={lang} key={lang}>
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
          <UrlWrapper>
            <StyledUrlFormikField name="link" showError>
              {({ field }: FieldProps) => (
                <InputV2 customCss={inputStyle} label={t('form.name.link')} {...field} />
              )}
            </StyledUrlFormikField>
            <StyledUrlFormikField name="linkText" showError>
              {({ field }: FieldProps) => (
                <InputV2 customCss={inputStyle} label={t('form.name.linkText')} {...field} />
              )}
            </StyledUrlFormikField>
          </UrlWrapper>
          <CampaignBlockImagePicker />
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

export default CampaignBlockForm;
