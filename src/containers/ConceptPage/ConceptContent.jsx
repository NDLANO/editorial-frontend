import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { UploadDropZone, Input } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import { animations, spacing, colors } from '@ndla/core';
import IconButton from '../../components/IconButton';
import FormikField from '../../components/FormikField';
import { Formik, Form, ErrorMessage } from 'formik';
import { formClasses } from '../FormikForm';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
import { FormikIngress } from '../FormikForm';
import Field from '../../../src/components/Field';

const ConceptContent = ({ t, formik: { values } }) => {
  return (
    <Form>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <FormikIngress name="content" />
    </Form>
  );
};

ConceptContent.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      id: PropTypes.number,
    }),
    //errors: PropTypes.shape({
    // alttext: PropTypes.string,
    //  caption: PropTypes.string,
    //}),
    //setFieldValue: PropTypes.func.isRequired,
  }),
};

export default injectT(connect(ConceptContent));
