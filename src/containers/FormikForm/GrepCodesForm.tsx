/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FormikHelpers, FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import GrepCodesFormContent from './GrepCodesFormContent';
import { ArticleType } from '../../interfaces';

interface Props {
  article: ArticleType;
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const GrepCodesForm = ({ t, article }: Props & tType) => {
  return (
    <Fragment>
      <FormikField name="grepCodes" label={t('form.grepCodes.label')}>
        {({ field, form }: FieldProps<string[], FormikValues>) => (
          <GrepCodesFormContent articleGrepCodes={article.grepCodes} field={field} form={form} />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(GrepCodesForm);
