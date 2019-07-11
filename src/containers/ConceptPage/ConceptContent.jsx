import React from 'react';
import { injectT } from '@ndla/i18n';
import FormikField from '../../components/FormikField';
import { FormikIngress } from '../FormikForm';

<<<<<<< HEAD
const ConceptContent = ({ t, formik: { values, errors, touched } }) => {
  return (
    <Form>
      <FormikField
        showError={false}
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />

      <FormikIngress name="description" />
    </Form>
  );
};
=======
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
>>>>>>> a49aa5eb5e06ddb60bb3868abaf85016c21633dd

export default injectT(ConceptContent);
