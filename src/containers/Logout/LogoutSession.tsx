/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router';
import { LocationShape } from '../../shapes';
import { useSession } from '../Session/SessionProvider';

interface Props extends RouteComponentProps {}

export const LogoutSession = ({ location }: Props) => {
  const { logout } = useSession();
  useEffect(() => {
    const query = queryString.parse(location.search);
    logout(false, !!query?.returnToLogin);
  }, []); //  eslint-disable-line

  return null;
};

LogoutSession.propTypes = {
  location: LocationShape,
};

export default LogoutSession;
