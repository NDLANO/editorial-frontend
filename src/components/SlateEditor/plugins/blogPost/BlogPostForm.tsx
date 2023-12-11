/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Formik, FieldInputProps } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { InputV2, RadioButtonGroup } from '@ndla/forms';
import { BlogPostEmbedData } from '@ndla/types-embed';
import InlineImageSearch from '../../../../containers/ConceptPage/components/InlineImageSearch';
import { frontpageLanguages } from '../../../../i18n2';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';

interface BlogPostFormValues {
  resource: 'blog-post';
  metaImageId?: number;
  language: string;
  title: string;
  size?: 'normal' | 'large';
  author?: string;
  link: string;
  metaImageAlt?: string;
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
  metaImageAlt: {
    required: true,
    onlyValidateIf: (value) => !!value.metaImageId,
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
    metaImageAlt: initialData?.alt ?? '',
  };
};

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
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
  & > label {
    white-space: nowrap;
  }
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
        alt: values.metaImageAlt ?? '',
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
                        {frontpageLanguages.map((lang) => (
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
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          <StyledFormikField name="metaImageAlt">
            {({ field, form }: FieldProps) => (
              <>
                {form.values.metaImageId && (
                  <InputV2 customCss={inputStyle} label={t('form.name.metaImageAlt')} {...field} />
                )}
              </>
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
