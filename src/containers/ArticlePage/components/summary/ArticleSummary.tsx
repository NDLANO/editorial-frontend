/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";

import { BlogPost } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FieldHeader from "../../../../components/Field/FieldHeader";

import { IngressField } from "../../../FormikForm";

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const ComponentRoot = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const ArticleSummary = () => {
  const { t } = useTranslation();

  const generateSummary = () => {
    // ... do something
  };

  return (
    <ComponentRoot>
      <FieldHeader title={t("editorSummary.title")}></FieldHeader>
      <IngressField placeholder={" "} showMaxLength={false} />
      <StyledButton size="small" onClick={generateSummary}>
        {t("editorSummary.generate")} <BlogPost />
      </StyledButton>
    </ComponentRoot>
  );
};

export default ArticleSummary;
