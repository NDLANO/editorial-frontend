/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';

import images from './modules/image/image';
import licenses from './modules/license/license';

const rootReducers = combineReducers({
  images,
  licenses,
});

export default rootReducers;
