/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, useNavigate, useLocation, Routes } from "react-router-dom";
import { HelmetWithTracker } from "@ndla/tracker";
import LoginFailure from "./LoginFailure";
import LoginProviders from "./LoginProviders";
import LoginSuccess from "./LoginSuccess";
import { useSession } from "../Session/SessionProvider";

export const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated } = useSession();
  useEffect(() => {
    if (authenticated && location.hash === "" && location.pathname.startsWith("/login/")) {
      navigate("/");
    }
  }, [authenticated, location.hash, location.pathname, navigate]);

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.loginPage")} />
      <Routes>
        <Route path="success/*" element={<LoginSuccess />} />
        <Route path="failure" element={<LoginFailure />} />
        <Route path="/" element={<LoginProviders />} />
      </Routes>
    </>
  );
};

export default Login;
