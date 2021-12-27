/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Route, Routes } from 'react-router-dom';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import loadable from '@loadable/component';
import LogoutProviders from './LogoutProviders';
import Footer from '../App/components/Footer';
const LogoutFederated = loadable(() => import('./LogoutFederated'));
const LogoutSession = loadable(() => import('./LogoutSession'));

const Logout = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.logoutPage')} />
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Routes>
            <Route path="federated" element={<LogoutFederated />} />
            <Route path="session" element={<LogoutSession />} />
            <Route path="" element={<LogoutProviders />} />
          </Routes>
        </div>
      </OneColumn>
      <Footer showLocaleSelector />
    </>
  );
};

export default Logout;
