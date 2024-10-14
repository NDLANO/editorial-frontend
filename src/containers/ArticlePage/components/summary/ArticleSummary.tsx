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
import { fetchAuthorized } from "../../../../util/apiHelpers";

import { IngressField } from "../../../FormikForm";

const StyledButton = styled(Button, {
  base: {
    color: "primary",
    _hover: {
      color: "stroke.subtle",
    },
  },
});

const ArticleSummary = () => {
  const { t } = useTranslation();

  const generateSummary = () => {
    const response = fetchAuthorized("/generate-summary");
  };

  return (
    <>
      <FieldHeader title={t("editorSummary.title")}>
        <StyledButton size="small" onClick={generateSummary}>
          {t("editorSummary.generate")} <BlogPost />
        </StyledButton>
      </FieldHeader>
      <IngressField placeholder={" "} showMaxLength={false} />
    </>
  );
};

export default ArticleSummary;
