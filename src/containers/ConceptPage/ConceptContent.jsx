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
import LastUpdatedLineConcept from '../../components/LastUpdatedLineConcept';
import { css } from '@emotion/core';

const byLineStyle = css`
  display: flex;
  margin-top: 0;
`;

const ConceptContent = props => {
  const {
    t,
    formik: {
      values: { creators, created },
    },
  } = props;
  return (
    <Form>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <FormikField name="created" css={byLineStyle}>
        {({ field, form }) => (
          <LastUpdatedLineConcept
            name={field.name}
            creators={creators}
            published={created}
            onChange={date => {
              console.log('inni onChange,', date);
              form.setFieldValue(field.name, date);
            }}
          />
        )}
      </FormikField>

      <FormikIngress name="description" maxLength={800} type="concept" />
    </Form>
  );
};

ConceptContent.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      title: PropTypes.string,
      created: PropTypes.string,
      id: PropTypes.number,
      published: PropTypes.string,
      creators: PropTypes.array,
      updatePublished: PropTypes.bool,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
    }),
    errors: PropTypes.shape({
      alttext: PropTypes.string,
      caption: PropTypes.string,
    }),
    touched: PropTypes.shape({
      alttext: PropTypes.bool,
      caption: PropTypes.bool,
    }),
  }),
};

export default injectT(connect(ConceptContent));
