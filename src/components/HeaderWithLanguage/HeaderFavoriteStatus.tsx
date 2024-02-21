/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Heart } from "@ndla/icons/action";
import { Text } from "@ndla/typography";
import { useResourceStats } from "../../modules/myndla/myndlaQueries";

const StyledHeartOutline = styled(Heart)`
  width: ${spacing.normal};
  height: ${spacing.normal};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  id: number | string | undefined;
  type: string | undefined;
}

const getResourceType = (type: string | undefined) => {
  switch (type) {
    case "standard":
    case "topic-article":
    case "frontpage-article":
      return "article";
    default:
      return type;
  }
};

const HeaderFavoriteStatus = ({ id, type }: Props) => {
  const favoriteMakesSense = id !== undefined && type !== undefined;
  const resourceType = getResourceType(type);
  const { t } = useTranslation();
  const { isLoading, isError, data } = useResourceStats(
    {
      resourceId: id?.toString() ?? "",
      resourceType: resourceType ?? "",
    },
    {
      enabled: favoriteMakesSense,
    },
  );

  if (!favoriteMakesSense || isError || isLoading || !data) return null;

  const tooltipText =
    data.favourites === 0 ? t("form.myNdla.noFavorites") : t("form.myNdla.numFavorites", { num: data.favourites });

  return (
    <Wrapper title={tooltipText} aria-label={tooltipText}>
      <StyledHeartOutline />
      <Text margin="none" textStyle="label-small">
        {data.favourites}
      </Text>
    </Wrapper>
  );
};

export default HeaderFavoriteStatus;
