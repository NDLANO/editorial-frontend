/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ErrorWarningFill } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild } from "@ndla/types-taxonomy";
import { getContentUriInfo } from "../../../util/taxonomyHelpers";

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.danger",
  },
});

const getArticleTypeFromId = (id?: string) => {
  if (id?.startsWith("urn:topic:")) return "topic-article";
  else if (id?.startsWith("urn:resource:")) return "standard";
  return undefined;
};

interface Props {
  resource: NodeChild;
  articleType?: string;
}

const WrongTypeError = ({ resource, articleType }: Props) => {
  const { t } = useTranslation();
  const isArticle = resource.contentUri?.startsWith("urn:article");
  if (!isArticle) return null;

  const expectedArticleType = getArticleTypeFromId(resource.id);
  if (expectedArticleType === articleType) return null;

  const missingArticleTypeError = t("taxonomy.info.missingArticleType", {
    id: getContentUriInfo(resource.contentUri)?.id,
  });

  const wrongArticleTypeError = t("taxonomy.info.wrongArticleType", {
    placedAs: t(`articleType.${expectedArticleType}`),
    isType: t(`articleType.${articleType}`),
  });

  const errorText = articleType ? wrongArticleTypeError : missingArticleTypeError;

  return <StyledErrorWarningFill title={errorText} aria-label={errorText} />;
};

export default WrongTypeError;
