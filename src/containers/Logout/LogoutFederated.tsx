/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../../modules/session/session';

type Logout = { federated: boolean; returnToLogin?: boolean };
interface Props {
  logout: (arg0: Logout) => void;
}

export const LogoutFederated = ({ logout }: Props) => {
  useEffect(() => {
    logout({ federated: true });
  }, []); //  eslint-disable-line

  return null;
};

LogoutFederated.propTypes = {
  logout: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatchToProps)(LogoutFederated);
