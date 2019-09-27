/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import FormikAddNotes from './FormikAddNotes';
import FormikField from '../../components/FormikField';
import { ArticleShape } from '../../shapes';

const FormikWorkflow = ({ article, t }) => (
  <FormikField name="notes" showError={false}>
    {({ field, form: { errors, touched } }) => (
      <FormikAddNotes
        showError={touched[field.name] && !!errors[field.name]}
        labelHeading={t('form.notes.heading')}
        labelAddNote={t('form.notes.add')}
        article={article}
        labelRemoveNote={t('form.notes.remove')}
        labelWarningNote={errors[field.name]}
        {...field}
      />
    )}
  </FormikField>
);

FormikWorkflow.propTypes = {
  article: ArticleShape,
};

FormikWorkflow.defaultProps = {
  article: {},
};

export default injectT(FormikWorkflow);
