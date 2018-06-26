/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { OneColumn, ErrorMessage } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

const Status = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      const context = staticContext;
      if (staticContext) {
        context.status = code;
      }
      return children;
    }}
  />
);

Status.propTypes = {
  code: PropTypes.number.isRequired,
};

const NotFound = ({ t }) => (
  <Status code={404}>
    <OneColumn cssModifier="clear">
      <ErrorMessage
        illustration={{
          url: '/not-exist.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('notFound.description'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    </OneColumn>
  </Status>
);

export default injectT(NotFound);
