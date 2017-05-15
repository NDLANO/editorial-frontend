/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { handleActions } from 'redux-actions';
import * as actions from '../containers/App/sessionActions';


export default handleActions({
  [actions.setUserData]: {
    next: (state, action) => action.payload,
    throw: state => state,
  },
  LOGOUT: () => ({}),
}, {});
