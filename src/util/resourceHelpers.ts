/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeType, ResourceType } from "@ndla/types-taxonomy";
import { constants } from "@ndla/ui";
import { TFunction } from "i18next";

const { contentTypeMapping } = constants;

export const getResourceLanguages = (t: TFunction) => [
  { id: "nb", name: t("languages.nb") },
  { id: "nn", name: t("languages.nn") },
  { id: "en", name: t("languages.en") },
  { id: "sma", name: t("languages.sma") },
  { id: "se", name: t("languages.se") },
  { id: "ukr", name: t("languages.ukr") },
  { id: "und", name: t("languages.und") },
  { id: "de", name: t("languages.de") },
  { id: "es", name: t("languages.es") },
  { id: "zh", name: t("languages.zh") },
];

export const getContentTypeFromResourceTypes = (
  resourceTypes: Pick<ResourceType, "id">[],
  nodeType?: NodeType,
): string => {
  const resourceType = resourceTypes.find((type) => !!contentTypeMapping[type.id]);
  if (resourceType) {
    return contentTypeMapping[resourceType.id];
  }
  if (nodeType === "TOPIC") {
    return contentTypeMapping["multidisciplinary"];
  }
  return contentTypeMapping.default;
};
