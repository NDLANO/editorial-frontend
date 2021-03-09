/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { Eye } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import FormikField from '../../../components/FormikField';
import { FormikIngress, FormikTitle } from '../../FormikForm';
import LastUpdatedLineConcept from '../../../components/LastUpdatedLineConcept';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import FormikVisualElement from '../../FormikForm/components/VisualElementForm';

const byLineStyle = css`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 64px;
`;

const ConceptContent = props => {
  const [preview, setPreview] = useState(false);
  const {
    t,
    formik: {
      values: { creators, created },
      handleBlur,
    },
    handleSubmit,
  } = props;

  return (
    <>
      <FormikTitle
        handleSubmit={handleSubmit}
        onBlur={(event, editor, next) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'slatetitle' } }), 0);
        }}
      />
      <FormikField noBorder name="created" css={byLineStyle}>
        {({ field, form }) => (
          <>
            <LastUpdatedLineConcept
              name={field.name}
              creators={creators}
              published={created}
              onChange={date => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <Tooltip tooltip={t('form.markdown.button')}>
                <ToggleButton active={preview} onClick={() => setPreview(!preview)}>
                  <Eye />
                </ToggleButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </>
        )}
      </FormikField>
      <FormikVisualElement />

      <FormikIngress
        name="conceptContent"
        maxLength={800}
        placeholder={t('form.name.conceptContent')}
        preview={preview}
        concept
        handleSubmit={handleSubmit}
        onBlur={(event, editor, next) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'content' } }), 0);
        }}
      />
    </>
  );
};

ConceptContent.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      slatetitle: PropTypes.string,
      created: PropTypes.string,
      id: PropTypes.number,
      published: PropTypes.string,
      creators: PropTypes.array,
      updatePublished: PropTypes.bool,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      slatetitle: PropTypes.string,
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
    handleBlur: PropTypes.func,
  }),
  handleSubmit: PropTypes.func,
};

export default injectT(connect(ConceptContent));
