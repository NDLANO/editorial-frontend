/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { HelmetWithTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import LogoutFederated from "./LogoutFederated";
import LogoutProviders from "./LogoutProviders";
import LogoutSession from "./LogoutSession";

const Logout = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.logoutPage")} />
      <OneColumn>
        <div>
          <Routes>
            <Route path="federated" element={<LogoutFederated />} />
            <Route path="session" element={<LogoutSession />} />
            <Route path="" element={<LogoutProviders />} />
          </Routes>
        </div>
      </OneColumn>
    </>
  );
};

export default Logout;
