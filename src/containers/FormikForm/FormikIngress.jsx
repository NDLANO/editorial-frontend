/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

const FormikIngress = ({ t, name, maxLength, placeholder }) => (
  <StyledFormContainer>
    <FormikField
      noBorder
      label={t('form.introduction.label')}
      name={name}
      showMaxLength
      maxLength={maxLength}>
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          placeholder={placeholder || t('form.introduction.label')}
          className="article_introduction"
          data-cy="learning-resource-ingress"
        />
      )}
    </FormikField>
  </StyledFormContainer>
);

FormikIngress.defaultProps = {
  name: 'introduction',
  maxLength: 300,
  type: 'ingress',
};

FormikIngress.propTypes = {
  name: PropTypes.string,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

export default injectT(FormikIngress);
