/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { Route, useNavigate, useLocation, Routes } from 'react-router-dom';
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

export const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated } = useSession();
  useEffect(() => {
    if (authenticated && location.hash === '' && location.pathname.startsWith('/login/')) {
      navigate('/');
    }
  }, [authenticated, location.hash, location.pathname, navigate]);

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.loginPage')} />
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Routes>
            <Route path="success/*" element={<LoginSuccess />} />
            <Route path="failure" element={<LoginFailure />} />
            <Route path="/" element={<LoginProviders />} />
          </Routes>
        </div>
      </OneColumn>
      <Footer showLocaleSelector />
    </>
  );
};

export default Login;
