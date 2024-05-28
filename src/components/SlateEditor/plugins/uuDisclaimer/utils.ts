/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DISCLAIMER } from "./types";
import { toEditFrontPageArticle, toEditLearningResource, toEditTopicArticle } from "../../../../util/routeHelpers";
import { defaultParagraphBlock } from "../paragraph/utils";

export const defaultDisclaimerBlock = (defaultDisclaimerText: string) => {
  return slatejsx(
    "element",
    {
      type: TYPE_DISCLAIMER,
      data: {
        resource: "uu-disclaimer",
        disclaimer: defaultDisclaimerText,
      },
    },
    defaultParagraphBlock(),
  );
};

export const toEditPage = (articleType: string, articleId: number, language: string) => {
  switch (articleType) {
    case "frontpage-article":
      return toEditFrontPageArticle(articleId, language);
    case "topic-article":
      return toEditTopicArticle(articleId, language);
    default:
      return toEditLearningResource(articleId, language);
  }
};
