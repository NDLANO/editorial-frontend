import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import FormikField from '../../components/FormikField';
import { FormikIngress } from '../FormikForm';
import { Form } from 'formik';

const ConceptContent = ({ t, values }) => {
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

ConceptContent.propTypes = {
  classes: PropTypes.func.isRequired,
  values: PropTypes.shape({
    id: PropTypes.number,
    filepath: PropTypes.string,
    audioFile: PropTypes.shape({
      fileSize: PropTypes.number,
      language: PropTypes.string,
      mimeType: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  setFieldValue: PropTypes.func.isRequired,
};

export default injectT(ConceptContent);
