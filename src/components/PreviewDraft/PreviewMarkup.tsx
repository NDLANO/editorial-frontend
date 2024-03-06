/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { IArticle } from "@ndla/types-backend/draft-api";
import { OneColumn } from "@ndla/ui";
import PreviewDraft from "./PreviewDraft";
import { PreviewBaseProps, StyledPreviewWrapper } from "./PreviewDraftLightboxV2";

export interface MarkupPreviewProps extends PreviewBaseProps {
  type: "markup";
  article: IArticle;
}

export const PreviewMarkup = ({ article, language }: MarkupPreviewProps) => {
  const { t } = useTranslation();
  return (
    <StyledPreviewWrapper>
      <OneColumn>
        <PreviewDraft
          type="article"
          draft={article}
          language={language}
          label={t("form.previewProductionArticle.article")}
        />
      </OneColumn>
    </StyledPreviewWrapper>
  );
};
