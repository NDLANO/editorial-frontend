/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { ErrorMessage, connect } from 'formik';
import BEMHelper from 'react-bem-helper';
import { FormikFieldHelp } from '../../../components/FormikField';
import { FormikShape } from '../../../shapes';
import FormikVisualElement from '../../FormikForm/FormikVisualElement';

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

const extraErrorFields = ['visualElementCaption', 'visualElementAlt'];

const TopicArticleVisualElement = ({
  t,
  formik: {
    values: { visualElementCaption, visualElementAlt, language },
  },
}) => {
  return (
    <Fragment>
      <FormikVisualElement
        t={t}
        language={language}
        name="visualElement"
      />
      {extraErrorFields.map(extraErrorField => (
        <ErrorMessage
          key={`topic_article_visualelement_${extraErrorField}`}
          name={extraErrorField}>
          {error => (
            <FormikFieldHelp error>
              <StyledErrorPreLine>{error}</StyledErrorPreLine>
            </FormikFieldHelp>
          )}
        </ErrorMessage>
      ))}
    </Fragment>
  );
};

TopicArticleVisualElement.propTypes = {
  formik: FormikShape,
};

export default injectT(connect(TopicArticleVisualElement));
