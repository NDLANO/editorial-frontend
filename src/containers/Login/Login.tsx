/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Switch, Route, RouteComponentProps } from 'react-router-dom';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import loadable from '@loadable/component';
import LoginProviders from './LoginProviders';
import Footer from '../App/components/Footer';
import { useSession } from '../Session/SessionProvider';
const LoginFailure = loadable(() => import('./LoginFailure'));
const LoginSuccess = loadable(() => import('./LoginSuccess'));

interface Props extends RouteComponentProps {}

export const Login = ({ match, location, history }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useSession();
  if (authenticated && location.hash === '' && match.url === '/login') {
    history.push('/');
    return null;
  }

  return (
    <>
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
    </>
  );
};

export default Login;
