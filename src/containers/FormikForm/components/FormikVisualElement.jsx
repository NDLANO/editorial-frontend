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
import { topicArticleContentToEditorValue } from '../../../util/articleContentConverter';

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

const extraErrorFields = ['visualElementCaption', 'visualElementAlt'];

const FormikVisualElement = ({
  t,
  formik,
  types,
  videoTypes,
  visualElementCaptionName,
  getArticle,
}) => {
  const [selectedResource, setSelectedResource] = useState(undefined);

  return (
    <Fragment>
      <FormikField name="visualElement">
        {({ field }) => (
          <div>
            <FieldHeader title={t('form.visualElement.title')} />
            <Fragment>
              <VisualElement
                label={t('form.visualElement.label')}
                changeVisualElement={setSelectedResource}
                types={types}
                resetSelectedResource={() => setSelectedResource(undefined)}
                {...field}
                resource={field.value.resource}
                language={formik.values.language}
                visualElementCaptionName={visualElementCaptionName}
                visualElementValue={topicArticleContentToEditorValue(
                  getArticle().visualElement,
                )}
              />
              <VisualElementSelectField
                selectedResource={selectedResource}
                resetSelectedResource={() => setSelectedResource(undefined)}
                videoTypes={videoTypes}
                {...field}
              />
            </Fragment>
          </div>
        )}
      </FormikField>
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

FormikVisualElement.propTypes = {
  formik: FormikShape,
  types: PropTypes.arrayOf(PropTypes.string),
  videoTypes: PropTypes.array,
  visualElementCaptionName: PropTypes.string,
  getArticle: PropTypes.func,
};

export default injectT(connect(FormikVisualElement));
