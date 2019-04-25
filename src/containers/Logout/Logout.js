/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import LogoutFederated from './LogoutFederated';
import LogoutSession from './LogoutSession';
import LogoutProviders from './LogoutProviders';
import Footer from '../App/components/Footer';

const Logout = ({ t, match }) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.logoutPage')} />
    <OneColumn cssModifier="clear">
      <div className="u-2/3@desktop u-push-1/3@desktop">
        <Switch>
          <Route path={`${match.url}/federated`} component={LogoutFederated} />
          <Route path={`${match.url}/session`} component={LogoutSession} />
          <Route component={LogoutProviders} />
        </Switch>
      </div>
    </OneColumn>
    <Footer />
  </Fragment>
);

Logout.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default injectT(Logout);
