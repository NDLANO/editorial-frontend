/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ErrorWarningFill } from "@ndla/icons/common";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  defaultVariants: {
    variant: "warning",
  },
  variants: {
    variant: {
      warning: { fill: "icon.subtle" },
      // TODO: update this color once icon error color is added to semantic tokens
      error: { fill: "surface.danger" },
    },
  },
});

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

      return <StyledErrorWarningFill aria-label={notPublishedWarning} title={notPublishedWarning} />;
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

    return <StyledErrorWarningFill aria-label={error} title={error} size="small" variant="error" />;
  }
  return null;
};

export default StructureErrorIcon;
