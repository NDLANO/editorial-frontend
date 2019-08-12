/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { Form } from 'formik';
import FormikField from '../../components/FormikField';
import { FormikIngress } from '../FormikForm';
import LastUpdatedLineConcept from '../../components/LastUpdatedLineConcept';

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
    <>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <FormikField noBorder name="created" css={byLineStyle}>
        {({ field, form }) => (
          <LastUpdatedLineConcept
            name={field.name}
            creators={creators}
            published={created}
            onChange={date => {
              form.setFieldValue(field.name, date);
            }}
          />
        )}
      </FormikField>

      <FormikIngress
        name="conceptContent"
        maxLength={800}
        placeholder={t('form.name.conceptContent')}
      />
    </>
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
