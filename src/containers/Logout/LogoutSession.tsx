/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { actions } from '../../modules/session/session';
import { LocationShape } from '../../shapes';

type Logout = { federated: boolean; returnToLogin?: boolean };
interface Props {
  logout: (arg0: Logout) => void;
  location: RouteComponentProps['location'];
}

export const LogoutSession = ({ logout, location }: Props) => {
  useEffect(() => {
    const query = queryString.parse(location.search);
    logout({ federated: false, returnToLogin: query && query.returnToLogin });
  }, [location.search, logout]);

  return null;
};

LogoutSession.propTypes = {
  logout: PropTypes.func.isRequired,
  location: LocationShape,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatchToProps)(LogoutSession);
