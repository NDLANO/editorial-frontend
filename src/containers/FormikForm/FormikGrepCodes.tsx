/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { FormikHelpers, FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import FormikGrepCodesContent from './FormikGrepCodesContent';
import { TranslateType, ArticleType } from '../../interfaces';

interface Props {
  t: TranslateType;
  article: ArticleType;
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const FormikGrepCodes = ({ t, article }: Props) => {
  return (
    <Fragment>
      <FormikField name="grepCodes" label={t('form.grepCodes.label')}>
        {({ field, form }: Props) => (
          <FormikGrepCodesContent
            t
            articleGrepCodes={article.grepCodes}
            field={field}
            form={form}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(FormikGrepCodes);
