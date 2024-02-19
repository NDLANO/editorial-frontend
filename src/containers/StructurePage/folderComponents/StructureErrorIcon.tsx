/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, colors } from "@ndla/core";
import { AlertCircle } from "@ndla/icons/editor";
import { Node } from "@ndla/types-taxonomy";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const StyledAlertIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.brand.grey};
`;

const StructureErrorIcon = (
  node: Node,
  isRoot: boolean,
  isTaxonomyAdmin: boolean,
  articleType?: string,
  isPublished?: boolean,
) => {
  const { t } = useTranslation();
  if (isRoot || node.nodeType !== "TOPIC") return null;
  if (articleType === "topic-article") {
    if (!isPublished) {
      const notPublishedWarning = t("taxonomy.info.notPublished");

      return <StyledAlertIcon aria-label={notPublishedWarning} title={notPublishedWarning} />;
    }
    return null;
  }

  if (isTaxonomyAdmin) {
    const missingArticleTypeError = t("taxonomy.info.missingArticleType", {
      id: getIdFromUrn(node.contentUri),
    });

    const wrongArticleTypeError = t("taxonomy.info.wrongArticleType", {
      placedAs: t(`articleType.topic-article`),
      isType: t(`articleType.standard`),
    });

    const error = !articleType ? missingArticleTypeError : wrongArticleTypeError;

    return <StyledWarnIcon aria-label={error} title={error} />;
  }
  return null;
};

export default StructureErrorIcon;
