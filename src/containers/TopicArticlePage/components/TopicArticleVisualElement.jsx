/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { ErrorMessage, connect } from 'formik';
import BEMHelper from 'react-bem-helper';
import { FieldHeader } from '@ndla/forms';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementMenu from '../../VisualElement/VisualElementMenu';
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

const TopicArticleVisualElement = ({
  t,
  formik: {
    values: { visualElementCaption, visualElementAlt, language },
  },
}) => {
  const [selectedResource, setSelectedResource] = useState(undefined);
  return (
    <Fragment>
      <FormikField name="visualElement">
        {({ field }) => (
          <div>
            <FieldHeader title={t('form.visualElement.title')} />
            {!field.value.resource && (
              <VisualElementMenu onSelect={setSelectedResource} />
            )}
            <Fragment>
              <VisualElement
                label={t('form.visualElement.label')}
                changeVisualElement={setSelectedResource}
                resetSelectedResource={() => setSelectedResource(undefined)}
                {...field}
                value={{
                  ...field.value,
                  caption: visualElementCaption,
                  alt: visualElementAlt,
                }}
                language={language}
              />
              <VisualElementSelectField
                selectedResource={selectedResource}
                resetSelectedResource={() => setSelectedResource(undefined)}
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

TopicArticleVisualElement.propTypes = {
  formik: FormikShape,
};

export default injectT(connect(TopicArticleVisualElement));
