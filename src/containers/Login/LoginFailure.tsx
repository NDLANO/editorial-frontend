/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import { connect } from 'react-redux';
import { ReduxState } from '../../interfaces';

interface Props{
  userNotRegistered: boolean;
}

export const LoginFailure = ({ t, userNotRegistered }: Props & tType) => (
  <div>
    <h2>{t('loginFailure.errorMessage')}</h2>
    {userNotRegistered && <p>{t('loginFailure.userNotRegistered')}</p>}
    <p>
      <Link to="/login">{t('loginFailure.loginLink')}</Link>
    </p>
  </div>
);


const mapStateToProps = (state: ReduxState) => ({
  userNotRegistered: state.session.userNotRegistered,
});

export default connect(mapStateToProps)(injectT(LoginFailure));
