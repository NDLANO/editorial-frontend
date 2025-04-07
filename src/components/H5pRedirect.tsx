/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { fetchH5PiframeUrl } from "./H5PElement/h5pApi";
import { routes } from "../util/routeHelpers";

const PageLayout = styled("div", {
  base: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

const H5pRedirect = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();

  fetchH5PiframeUrl(language)
    .then(({ url }) => window.location.replace(url))
    .catch(() => navigate(routes.notFound));

  return (
    <PageLayout>
      <Spinner />
    </PageLayout>
  );
};

export default H5pRedirect;
