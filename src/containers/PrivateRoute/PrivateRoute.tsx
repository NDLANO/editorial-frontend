/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { Navigate, useLocation } from "react-router";
import { loginPersonalAccessToken } from "../../util/authHelpers";
import { toLogin } from "../../util/routeHelpers";
import { useSession } from "../Session/SessionProvider";

const okPaths = ["/login", "/logout"];

interface Props {
  component: JSX.Element;
}

const PrivateRoute = ({ component }: Props) => {
  const { authenticated } = useSession();
  const location = useLocation();

  if (
    !authenticated &&
    window.location.pathname &&
    !okPaths.find((okPath) => window.location.pathname.includes(okPath))
  ) {
    const lastPath = `${window.location.pathname}${window.location.search ?? ""}`;
    localStorage.setItem("lastPath", lastPath);
    loginPersonalAccessToken("google-oauth2");
    return <div />;
  }

  if (!authenticated) {
    return <Navigate to={{ pathname: toLogin() }} state={{ from: location }} />;
  }
  return component;
};

export default PrivateRoute;
