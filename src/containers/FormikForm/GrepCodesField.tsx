/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import GrepCodesFieldContent from './GrepCodesFieldContent';
import { ArticleType } from '../../interfaces';

interface Props {
  article: ArticleType;
}

const GrepCodesField = ({ t, article }: Props & tType) => {
  return (
    <Fragment>
      <FormikField name="grepCodes" label={t('form.grepCodes.label')}>
        {({ field, form }: FieldProps<string[], FormikValues>) => (
          <GrepCodesFieldContent articleGrepCodes={article.grepCodes} field={field} form={form} />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(GrepCodesField);
