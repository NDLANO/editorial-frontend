/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ErrorWarningFill } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { PUBLISHED } from "../../../constants";
import { NodeResourceMeta } from "../../../modules/nodes/nodeApiTypes";
import { getIdFromContentURI } from "../../../util/taxonomyHelpers";

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  defaultVariants: {
    variant: "warning",
  },
  variants: {
    variant: {
      warning: { fill: "icon.subtle" },
      error: { fill: "icon.danger" },
    },
  },
});

interface Props {
  node: Node;
  meta: NodeResourceMeta | undefined;
  isRoot: boolean;
  isTaxonomyAdmin: boolean;
}

const StructureErrorIcon = ({ node, meta, isRoot, isTaxonomyAdmin }: Props) => {
  const { t } = useTranslation();
  if (isRoot || node.nodeType !== "TOPIC") return null;
  const articleType = meta?.articleType;
  if (articleType === "topic-article") {
    const isPublished = meta?.status?.current === PUBLISHED || meta?.status?.other.includes(PUBLISHED);
    if (!isPublished) {
      const notPublishedWarning = t("taxonomy.info.notPublished");

      return <StyledErrorWarningFill aria-label={notPublishedWarning} title={notPublishedWarning} />;
    }
    return null;
  }

  if (isTaxonomyAdmin) {
    const missingArticleTypeError = t("taxonomy.info.missingArticleType", {
      id: getIdFromContentURI(node.contentUri),
    });

    const wrongArticleTypeError = t("taxonomy.info.wrongArticleType", {
      placedAs: t(`articleType.topic-article`),
      isType: t(`articleType.standard`),
    });

    const error = !articleType ? missingArticleTypeError : wrongArticleTypeError;

    return <StyledErrorWarningFill aria-label={error} title={error} variant="error" />;
  }
  return null;
};

export default StructureErrorIcon;
