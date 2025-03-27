/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { styled } from "@ndla/styled-system/jsx";
import H5PElement from "../../components/H5PElement/H5PElement";
import { PageLayout } from "../../components/Layout/PageLayout";

const H5PWrapper = styled("div", {
  base: {
    display: "flex",
    flex: "1",
    flexDirection: "column",
  },
});

const H5PPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  return (
    <PageLayout>
      <H5PWrapper>
        <title>{t("htmlTitles.h5pPage")}</title>
        <H5PElement
          canReturnResources={false}
          onSelect={() => {}}
          onClose={() => {
            navigate("/");
          }}
          locale={locale}
        />
      </H5PWrapper>
    </PageLayout>
  );
};

export default H5PPage;
