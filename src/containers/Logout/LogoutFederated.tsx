/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSession } from '../Session/SessionProvider';

export const LogoutFederated = () => {
  const { logout } = useSession();
  useEffect(() => {
    logout(true);
  }, []); //  eslint-disable-line

  return null;
};

LogoutFederated.propTypes = {
  authenticated: PropTypes.func.isRequired,
};

export default LogoutFederated;
