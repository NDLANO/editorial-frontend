/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation, Navigate } from "react-router";
import { useSession } from "../Session/SessionProvider";

export const Login = () => {
  const location = useLocation();
  const { authenticated } = useSession();

  if (authenticated && location.hash === "" && location.pathname.startsWith("/login/")) {
    return <Navigate to="/" replace />;
  }
  // TODO: This can probably be replaced with an error
  return null;
};

export const Component = Login;
