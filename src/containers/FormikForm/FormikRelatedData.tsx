/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { FormikHelpers, FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import { ArticleType, ConceptType, ConvertedRelatedContent } from '../../interfaces';
import FormikConcepts from './FormikConcepts';
import FormikRelatedContent from './FormikRelatedContent';

interface Props {
  article: ArticleType;
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
  values: {
    conceptIds: ConceptType[];
    relatedContent: ConvertedRelatedContent[];
  };
  locale: string;
}

const FormikRelatedData = ({ locale, values }: Props) => {
  return (
    <Fragment>
      <FormikField name={'conceptIds'}>
        {({ field, form }) => (
          <FormikConcepts field={field} form={form} locale={locale} values={values} />
        )}
      </FormikField>
      <FormikField name={'relatedContent'}>
        {({ field, form }) => (
          <FormikRelatedContent field={field} form={form} locale={locale} values={values} />
        )}
      </FormikField>
    </Fragment>
  );
};

export default FormikRelatedData;
