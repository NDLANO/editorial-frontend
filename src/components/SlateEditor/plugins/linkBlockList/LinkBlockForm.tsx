/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkBlockEmbedData } from '@ndla/types-embed';
import { useTranslation } from 'react-i18next';
import { FieldProps, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { InputV2 } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { spacing, fonts } from '@ndla/core';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '@ndla/modal';
import { css } from '@emotion/react';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import { supportedLanguages } from '../../../../i18n2';
import FormikField from '../../../FormikField';
import InlineDatePicker from '../../../../containers/FormikForm/components/InlineDatePicker';
import { formatDateForBackend } from '../../../../util/formatDate';

interface Props {
  embed?: LinkBlockEmbedData;
  existingEmbeds: LinkBlockEmbedData[];
  onSave: (embed: LinkBlockEmbedData) => void;
}

interface LinkBlockFormValues extends Omit<LinkBlockEmbedData, 'date'> {
  date?: Date;
}

const toInitialValues = (
  initialData: LinkBlockEmbedData | undefined,
  language: string,
): LinkBlockFormValues => {
  return {
    resource: 'link-block',
    title: initialData?.title ?? '',
    language: initialData?.language ?? language,
    date: initialData?.date ? new Date(initialData.date) : undefined,
    url: initialData?.url ?? '',
  };
};

const ButtonContainer = styled.div`
  padding-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const inputStyle = css`
  display: flex;
  flex-direction: column;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin-top: ${spacing.small};
  label {
    font-weight: ${fonts.weight.semibold};
  }
`;

const LinkBlockForm = ({ embed, existingEmbeds, onSave }: Props) => {
  const { t, i18n } = useTranslation();

  const rules: RulesType<LinkBlockFormValues> = useMemo(() => {
    return {
      title: {
        required: true,
      },
      language: {
        required: true,
      },
      date: {
        required: false,
      },
      url: {
        required: true,
        url: true,
        test: (value) => {
          const exists = existingEmbeds.some((embed) => embed.url === value.url);
          if (!exists) return undefined;
          return { translationKey: 'linkBlock.linkExists' };
        },
      },
    };
  }, [existingEmbeds]);

  const validate = useCallback(
    (values: LinkBlockFormValues) => {
      return validateFormik(values, rules, t);
    },
    [t, rules],
  );

  const onFormSaved = useCallback(
    ({ date, title, url, language }: LinkBlockFormValues) => {
      const embed = {
        resource: 'link-block',
        title,
        date: date ? formatDateForBackend(new Date(date)) : '',
        url,
        language,
      } as const;
      onSave(embed);
    },
    [onSave],
  );

  const initialValues = useMemo(
    () => toInitialValues(embed, i18n.language),
    [embed, i18n.language],
  );
  const initialErrors = useMemo(
    () => validateFormik(initialValues, rules, t),
    [initialValues, t, rules],
  );

  return (
    <>
      <ModalHeader>
        <ModalTitle>{embed ? t('linkBlock.edit') : t('linkBlock.create')}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          initialErrors={initialErrors}
          validateOnMount
          onSubmit={onFormSaved}
          validate={validate}
        >
          {({ dirty, isValid, handleSubmit }) => (
            <>
              <StyledFormikField name="title" showError>
                {({ field }: FieldProps) => (
                  <InputV2 {...field} customCss={inputStyle} label={t('form.name.title')} />
                )}
              </StyledFormikField>
              <StyledFormikField name="language">
                {({ field }: FieldProps) => (
                  <FieldWrapper>
                    <label htmlFor="language">{t('form.name.language')}</label>
                    <select {...field} title={t('blogPostForm.languageExplanation')}>
                      {supportedLanguages.map((lang) => (
                        <option value={lang} key={lang}>
                          {t(`languages.${lang}`)}
                        </option>
                      ))}
                    </select>
                  </FieldWrapper>
                )}
              </StyledFormikField>
              <StyledFormikField name="url" showError>
                {({ field }: FieldProps) => (
                  <InputV2 label={t('form.name.url')} customCss={inputStyle} {...field} />
                )}
              </StyledFormikField>
              <StyledFormikField name="date">
                {({ field }) => (
                  <FieldWrapper>
                    <label>{t('form.name.date')}</label>
                    <InlineDatePicker
                      placeholder={t('linkBlock.chooseDate')}
                      locale={i18n.language}
                      {...field}
                    />
                  </FieldWrapper>
                )}
              </StyledFormikField>
              <ButtonContainer>
                <ModalCloseButton>
                  <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
                </ModalCloseButton>
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
      </ModalBody>
    </>
  );
};

export default LinkBlockForm;
