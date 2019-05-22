/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import LoginFailure from './LoginFailure';
import LoginSuccess from './LoginSuccess';
import LoginProviders from './LoginProviders';
import Footer from '../App/components/Footer';

export const Login = ({ t, match, authenticated, location, history }) => {
  if (authenticated && location.hash === '' && match.url === '/login') {
    history.push('/');
    return null;
  }

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.loginPage')} />
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/success`} component={LoginSuccess} />
            <Route path={`${match.url}/failure`} component={LoginFailure} />
            <Route component={LoginProviders} />
          </Switch>
        </div>
      </OneColumn>
      <Footer />
    </Fragment>
  );
};

Login.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({}),
  history: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  authenticated: state.session.authenticated,
});

export default connect(mapStateToProps)(injectT(Login));
