/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { FlatArticleKeys } from "./types";
import { hasArticleFieldsChanged } from "../../../components/HeaderWithLanguage/util";
import { PUBLISHED } from "../../../constants";

interface PanelTitleProps {
  title: string;
  article: IArticleDTO | undefined;
  articleHistory: IArticleDTO[] | undefined;
  fieldsToIndicatedChangesFor: FlatArticleKeys[];
}

const StyledSpan = styled("span", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "baseline",
  },
});

const PanelTitleWithChangeIndicator = ({
  title,
  fieldsToIndicatedChangesFor,
  article,
  articleHistory,
}: PanelTitleProps) => {
  const { t } = useTranslation();
  const hasChanges = useMemo(() => {
    const lastPublishedVersion = articleHistory?.find((a) => a.status.current === PUBLISHED);
    return hasArticleFieldsChanged(article, lastPublishedVersion, fieldsToIndicatedChangesFor);
  }, [article, articleHistory, fieldsToIndicatedChangesFor]);

  if (hasChanges) {
    return (
      <StyledSpan>
        <span>{title}</span>
        <Text asChild consumeCss color="text.subtle" textStyle="label.small">
          <span>{t("form.unpublishedChanges")}</span>
        </Text>
      </StyledSpan>
    );
  }

  return title;
};

export default PanelTitleWithChangeIndicator;
