/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import { resolveJsonOrRejectWithError } from '../util/apiHelpers';

 export const fetchNewToken = () => fetch('/get_token').then(resolveJsonOrRejectWithError);

 export const isTokenValid = tokenExp => fetch(`/is_token_valid?tokenExp=${tokenExp}`).then(resolveJsonOrRejectWithError);
