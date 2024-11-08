/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Outlet } from "react-router-dom";
import { Masthead } from "../../containers/Masthead/Masthead";

export const MastheadLayout = () => (
  <>
    <Masthead />
    <Outlet />
  </>
);
