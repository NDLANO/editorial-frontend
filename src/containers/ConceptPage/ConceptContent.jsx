import React from 'react';
import { injectT } from '@ndla/i18n';
import FormikField from '../../components/FormikField';
import { FormikIngress } from '../FormikForm';

const ConceptContent = ({ t }) => (
  <>
    <FormikField
      label={t('form.title.label')}
      name="title"
      title
      noBorder
      placeholder={t('form.title.label')}
    />
    <FormikIngress name="description" />
  </>
);

export default injectT(ConceptContent);
