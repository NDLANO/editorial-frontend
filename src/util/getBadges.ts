/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RESOURCE_FILTER_SUPPLEMENTARY } from "../constants";

interface BadgeParams {
  /** Article traits */
  traits?: string[];
  /** The actual resource types attached to a node. Prefer resourceType over passing in additional stuff here. */
  resourceTypes?: { id: string; name: string }[];
  relevanceId?: string;
  /** Useful for items that do not support resource types (subjects, topics, images etc). Omitted if resourceTypes are defined. */
  resourceType?: string;
}

// TODO: Translations
export const getBadges = (params: BadgeParams, t: (key: string) => string) => {
  const badges: string[] = [];

  if (params.resourceType && !params.resourceTypes?.length) {
    badges.push(t(`contentTypes.${params.resourceType}`));
  }

  if (params.resourceTypes?.length) {
    badges.push(...params.resourceTypes.map((rt) => rt.name));
  }

  if (params.traits?.length) {
    const translated = params.traits.map((trait) => t(`articleTraits.${trait}`));
    badges.push(...translated);
  }

  if (params.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY) {
    badges.push(t("relevance.supplementary"));
  }

  return badges;
};

export const useBadges = (params: BadgeParams) => {
  const { t } = useTranslation();

  const badges = useMemo(() => getBadges(params, t), [t, params]);

  return badges;
};
