/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Masthead } from "../../containers/Masthead/Masthead";
import Messages from "../../containers/Messages/Messages";

export const MastheadLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet meta={[{ name: "description", content: t("meta.description") }]} />
      <Masthead />
      <Outlet />
      <Messages />
    </>
  );
};
