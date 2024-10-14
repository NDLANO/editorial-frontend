/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BlogPost } from "@ndla/icons/editor";
import { Button, Spinner, TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FieldHeader from "../../../../components/Field/FieldHeader";

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
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = () => {
    // ... do something
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ComponentRoot>
      <FieldHeader title={t("editorSummary.title")}></FieldHeader>
      <TextArea />
      <StyledButton size="small" onClick={generateSummary}>
        {t("editorSummary.generate")} {isLoading ? <Spinner size="small" /> : <BlogPost />}
      </StyledButton>
    </ComponentRoot>
  );
};

export default ArticleSummary;
