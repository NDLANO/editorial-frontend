/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/fp/isEqual";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { IArticle } from "@ndla/types-backend/draft-api";
import { Text } from "@ndla/typography";
import { PUBLISHED } from "../../../constants";

const contentPanelChanges = (
  current: IArticle | undefined,
  lastPublished: IArticle | undefined,
  fields: (keyof IArticle)[],
): boolean => {
  if (current === undefined || lastPublished === undefined) return false;
  for (const field of fields) {
    if (!isEqual(current[field], lastPublished[field])) return true;
  }
  return false;
};

const StyledText = styled(Text)`
  color: ${colors.brand.grey};
`;

interface PanelTitleProps {
  title: string;
  article: IArticle | undefined;
  articleHistory: IArticle[] | undefined;
  fieldsToIndicatedChangesFor: (keyof IArticle)[];
}

const PanelTitleWithChangeIndicator = ({
  title,
  fieldsToIndicatedChangesFor,
  article,
  articleHistory,
}: PanelTitleProps) => {
  const { t } = useTranslation();
  const hasChanges = useMemo(() => {
    const lastPublishedVersion = articleHistory?.find((a) => a.status.current === PUBLISHED);
    return contentPanelChanges(article, lastPublishedVersion, fieldsToIndicatedChangesFor);
  }, [article, articleHistory, fieldsToIndicatedChangesFor]);

  if (hasChanges) {
    return (
      <>
        <span data-underline="">{title}</span>
        <StyledText element="span" textStyle="meta-text-small">
          {t("form.unpublishedChanges")}
        </StyledText>
      </>
    );
  }

  return title;
};

export default PanelTitleWithChangeIndicator;
