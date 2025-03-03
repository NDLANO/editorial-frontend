/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text, Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ResourceStats } from "../utils";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

interface Props {
  matomoStats: ResourceStats | undefined;
  matomoStatsIsPending: boolean;
  matomoStatsIsError: boolean;
}
const MatomoStats = ({ matomoStats, matomoStatsIsPending, matomoStatsIsError }: Props) => {
  const { t } = useTranslation();

  if (matomoStatsIsError) {
    return (
      <Text textStyle="body.small" color="text.error">
        {t("matomo.error")}
      </Text>
    );
  }

  if (matomoStatsIsPending) {
    return (
      <Skeleton css={{ width: "30%" }}>
        <Text textStyle="body.small">&nbsp;</Text>
      </Skeleton>
    );
  }

  return matomoStats ? (
    <TextWrapper>
      <Text textStyle="body.small" color="text.subtle">{`${matomoStats.year}:`}</Text>
      <Text textStyle="body.small" color="text.subtle">
        {t("matomo.visits", { count: matomoStats.nb_visits })}
      </Text>
      <Text color="text.subtle" aria-hidden>
        |
      </Text>
      <Text textStyle="body.small" color="text.subtle">
        {t("matomo.hits", { count: matomoStats.nb_hits })}
      </Text>
      <Text color="text.subtle" aria-hidden>
        |
      </Text>
      <Text textStyle="body.small" color="text.subtle">
        {t("matomo.avgTime", { time: matomoStats.avg_time_on_page })}
      </Text>
    </TextWrapper>
  ) : null;
};

export default MatomoStats;
