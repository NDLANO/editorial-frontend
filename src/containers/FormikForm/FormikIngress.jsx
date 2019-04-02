/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import StyledFormContainer from '../../components/SlateEditor/common/StyledFormContainer';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import FormikField from '../../components/FormikField';

const FormikIngress = ({ t }) => (
  <StyledFormContainer>
    <FormikField
      noBorder
      label={t('form.introduction.label')}
      name="introduction"
      showMaxLength
      maxLength={300}>
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          placeholder={t('form.introduction.label')}
          className="article_introduction"
          data-cy="learning-resource-ingress"
        />
      )}
    </FormikField>
  </StyledFormContainer>
);

export default injectT(FormikIngress);
