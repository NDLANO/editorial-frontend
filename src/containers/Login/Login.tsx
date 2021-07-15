/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import loadable from '@loadable/component';
import LoginProviders from './LoginProviders';
import Footer from '../App/components/Footer';
import { ReduxState } from '../../interfaces';
const LoginFailure = loadable(() => import('./LoginFailure'));
const LoginSuccess = loadable(() => import('./LoginSuccess'));

interface Props {
  match: RouteComponentProps['match'];
  location: RouteComponentProps['location'];
  history: RouteComponentProps['history'];
  authenticated: boolean;
}

export const Login = ({ t, match, authenticated, location, history }: Props & tType) => {
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
      <Footer showLocaleSelector />
    </Fragment>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  authenticated: state.session.authenticated,
});

export default connect(mapStateToProps)(injectT(Login));
