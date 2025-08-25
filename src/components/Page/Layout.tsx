/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Masthead } from "../../containers/Masthead/Masthead";
import Messages from "../../containers/Messages/Messages";
import { Footer } from "../Footer";
import { PageLayout } from "../Layout/PageLayout";

export const Layout = () => {
  const { t } = useTranslation();
  return (
    <>
      <meta name="description" content={t("meta.description")} />
      <Masthead />
      <PageLayout>
        <Outlet />
      </PageLayout>
      <Footer />
      <Messages />
    </>
  );
};
