/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { ErrorMessage, connect } from 'formik';
import BEMHelper from 'react-bem-helper';
import { FieldHeader } from '@ndla/forms';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElement from '../../VisualElement/VisualElement';
import FormikField, { FormikFieldHelp } from '../../../components/FormikField';
import { FormikShape } from '../../../shapes';

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

const extraErrorFields = ['visualElementCaption', 'visualElementAlt'];

const VisualElementForm = ({ t, formik, isSubjectPage, types, videoTypes }) => {
  const [selectedResource, setSelectedResource] = useState(undefined);

  return (
    <Fragment>
      <FormikField name="visualElement">
        {({ field }) => (
          <div>
            <FieldHeader title={t('form.visualElement.title')} />
            <Fragment>
              <VisualElement
                changeVisualElement={setSelectedResource}
                label={t('form.visualElement.label')}
                language={formik.values.language}
                isSubjectPage={isSubjectPage}
                types={types}
                {...field}
              />
              <VisualElementSelectField
                selectedResource={selectedResource}
                resetSelectedResource={() => setSelectedResource(undefined)}
                videoTypes={videoTypes}
                articleLanguage={formik.values.language}
                {...field}
              />
            </Fragment>
          </div>
        )}
      </FormikField>
      {extraErrorFields.map(extraErrorField => (
        <ErrorMessage key={`topic_article_visualelement_${extraErrorField}`} name={extraErrorField}>
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

VisualElementForm.propTypes = {
  formik: FormikShape,
  isSubjectPage: PropTypes.bool,
  types: PropTypes.arrayOf(PropTypes.string),
  videoTypes: PropTypes.array,
  visualElementCaptionName: PropTypes.string,
  getArticle: PropTypes.func,
};

export default injectT(connect(VisualElementForm));
