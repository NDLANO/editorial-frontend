/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { HeartFill } from "@ndla/icons/action";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useResourceStats } from "../../modules/myndla/myndlaQueries";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
  },
});

interface Props {
  id: number | string | undefined;
  type: string | undefined;
  favoriteCount?: number;
}

const getResourceType = (type: string | undefined) => {
  switch (type) {
    case "standard":
    case "topic-article":
    case "frontpage-article":
      return "article,multidiciplinary,topic";
    default:
      return type;
  }
};

const HeaderFavoriteStatus = ({ id, type, favoriteCount }: Props) => {
  const favoriteMakesSense = id !== undefined && type !== undefined;
  const resourceType = getResourceType(type);
  const { t } = useTranslation();
  const { isLoading, isError, data } = useResourceStats(
    {
      resourceIds: id?.toString() ?? "",
      resourceTypes: resourceType ?? "",
    },
    {
      enabled: favoriteMakesSense && favoriteCount === undefined,
    },
  );

  if (!favoriteMakesSense || isError || isLoading || (!data?.length && favoriteCount === undefined)) return null;

  const resourceFavorites =
    favoriteCount !== undefined ? favoriteCount : data?.find((d) => d.id === id.toString())?.favourites;
  const tooltipText =
    resourceFavorites === 0 ? t("form.myNdla.noFavorites") : t("form.myNdla.numFavorites", { num: resourceFavorites });

  return (
    <Wrapper title={tooltipText} aria-label={tooltipText}>
      <HeartFill />
      <Text textStyle="label.small" fontWeight="bold">
        {resourceFavorites}
      </Text>
    </Wrapper>
  );
};

export default HeaderFavoriteStatus;
