/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldProps, Formik, FieldInputProps } from 'formik';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { InputV2 } from '@ndla/forms';
import { spacing } from '@ndla/core';
import { BlogPostEmbedData } from '@ndla/types-embed';
import { RadioButtonGroup } from '@ndla/ui';
import { ButtonV2 } from '@ndla/button';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import FormikField from '../../../FormikField';
import InlineImageSearch from '../../../../containers/ConceptPage/components/InlineImageSearch';
import { supportedLanguages } from '../../../../i18n2';

interface BlogPostFormValues {
  resource: 'blog-post';
  metaImageId?: number;
  language: string;
  title: string;
  size?: 'normal' | 'large';
  author?: string;
  link: string;
}

const rules: RulesType<BlogPostFormValues> = {
  title: {
    required: true,
  },
  metaImageId: {
    required: true,
  },
  size: {
    required: true,
  },
  language: {
    required: true,
  },
  link: {
    required: true,
    url: true,
  },
};

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
`;

const toInitialValues = (initialData?: BlogPostEmbedData): BlogPostFormValues => {
  return {
    resource: 'blog-post',
    title: initialData?.title ?? '',
    metaImageId: initialData?.imageId ? parseInt(initialData.imageId) : undefined,
    size: initialData?.size ?? 'normal',
    language: initialData?.language ?? 'nb',
    link: initialData?.url ?? '',
    author: initialData?.author ?? '',
  };
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

interface Props {
  initialData?: BlogPostEmbedData;
  onSave: (data: BlogPostEmbedData) => void;
  onCancel: () => void;
}

const inputStyle = css`
  display: flex;
  flex-direction: column;
`;

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const BlogPostForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: BlogPostFormValues) => {
      if (!values.metaImageId) {
        return;
      }

      const newData: BlogPostEmbedData = {
        resource: 'blog-post',
        imageId: values.metaImageId.toString(),
        language: values.language,
        title: values.title,
        size: values.size,
        author: values.author ?? '',
        url: values.link,
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
          <StyledFormikField name="author" showError>
            {({ field }: FieldProps) => (
              <InputV2 customCss={inputStyle} label={t('form.name.author')} {...field} />
            )}
          </StyledFormikField>
          <StyledFormikField name="link" showError>
            {({ field }: FieldProps) => (
              <InputV2 customCss={inputStyle} label={t('form.name.link')} {...field} />
            )}
          </StyledFormikField>
          <StyledFormikField name="size" showError>
            {({ field }: FieldProps) => <SizeField field={field} />}
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

interface SizeFieldProps {
  field: FieldInputProps<string>;
}

const SizeField = ({ field }: SizeFieldProps) => {
  const { t } = useTranslation();
  const availabilityValues: string[] = ['normal', 'large'];

  return (
    <RadioButtonGroup
      label={t('form.name.size')}
      selected={field.value}
      uniqeIds
      options={availabilityValues.map((value) => ({
        title: t(`blogPostForm.sizes.${value}`),
        value: value,
      }))}
      onChange={(value: string) =>
        field.onChange({
          target: {
            name: field.name,
            value: value,
          },
        })
      }
    />
  );
};

export default BlogPostForm;