/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { actions } from '../../modules/session/session';
import { LocationShape } from '../../shapes';
import { RouteComponentProps } from 'react-router';

interface Props {
  logout: ({}) => void;
  location: RouteComponentProps['location'];
}

export const LogoutSession = ({logout, location}: Props) => {
  useEffect(() => {
    const query = queryString.parse(location.search);
    logout({ federated: false, returnToLogin: query && query.returnToLogin });
  }, [])

  return null;

}

LogoutSession.propTypes = {
  logout: PropTypes.func.isRequired,
  location: LocationShape,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatchToProps)(LogoutSession);
