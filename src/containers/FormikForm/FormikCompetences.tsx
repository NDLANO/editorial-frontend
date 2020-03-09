/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { FormikActions, FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import FormikCompetencesContent from './FormikCompetencesContent';
import { TranslateType, ArticleType } from '../../interfaces';

interface Props {
  t: TranslateType;
  article: ArticleType;
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikActions<FormikValues>['setFieldTouched'];
  };
}

const FormikCompetences = ({ t, article }: Props) => {
  return (
    <Fragment>
      <FormikField name="competences" label={t('form.competences.label')}>
        {({ field, form }: Props) => (
          <FormikCompetencesContent
            t
            articleCompetences={article.competences}
            field={field}
            form={form}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(FormikCompetences);
