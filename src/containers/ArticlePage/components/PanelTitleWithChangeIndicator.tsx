/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { Text } from "@ndla/typography";
import { removeCommentTags } from "../../../util/compareHTMLHelpers";

interface HtmlCompareObject {
  current: string | undefined;
  published: string | undefined;
  isHtml: true;
}
interface CompareObject {
  current: any;
  published: any;
  isHtml: false;
}

const contentPanelChanges = (compareData: (HtmlCompareObject | CompareObject)[]): boolean => {
  for (const compareObject of compareData) {
    if (compareObject.isHtml) {
      const currentWithoutComments = compareObject.current ? removeCommentTags(compareObject.current) : "";
      const publishedWithoutComments = compareObject.published ? removeCommentTags(compareObject.published) : "";
      if (!isEqual(currentWithoutComments, publishedWithoutComments)) return true;
    } else {
      if (!isEqual(compareObject.current, compareObject.published)) return true;
    }
  }
  return false;
};

const StyledText = styled(Text)`
  color: ${colors.brand.grey};
`;

interface PanelTitleProps {
  title: string;
  compareData: (HtmlCompareObject | CompareObject)[];
}

const PanelTitleWithChangeIndicator = ({ title, compareData }: PanelTitleProps) => {
  const { t } = useTranslation();
  const hasChanges = useMemo(() => contentPanelChanges(compareData), [compareData]);

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
