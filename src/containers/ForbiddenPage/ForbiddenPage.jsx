/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { OneColumn } from 'ndla-ui';
import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
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

const Forbidden = ({ t }) => (
  <Status code={403}>
    <OneColumn>
      <div>
        <h2>403 - {t('forbiddenPage.description')}</h2>
      </div>
    </OneColumn>
  </Status>
);

export default compose(injectT)(Forbidden);
