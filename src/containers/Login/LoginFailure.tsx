/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../Session/SessionProvider';

export const LoginFailure = () => {
  const { t } = useTranslation();
  const { userNotRegistered } = useSession();
  return (
    <div>
      <h2>{t('loginFailure.errorMessage')}</h2>
      {userNotRegistered && <p>{t('loginFailure.userNotRegistered')}</p>}
      <p>
        <Link to="/login">{t('loginFailure.loginLink')}</Link>
      </p>
    </div>
  );
};

export default LoginFailure;
