/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { LineChartLine } from "@ndla/icons";
import {
  Text,
  Skeleton,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  Button,
  PopoverTitle,
  UnOrderedList,
} from "@ndla/primitives";
import { ResourceStats } from "../utils";

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
      <Skeleton css={{ width: "xxlarge" }}>
        <Text textStyle="body.small">&nbsp;</Text>
      </Skeleton>
    );
  }

  return (
    <PopoverRoot>
      <PopoverTrigger
        asChild
        disabled={!matomoStats}
        aria-label={matomoStats ? t("matomo.popoverDescription", { count: matomoStats.nb_visits }) : t("matomo.noData")}
        title={matomoStats ? t("matomo.popoverDescription", { count: matomoStats.nb_visits }) : t("matomo.noData")}
      >
        <Button size="small" variant="secondary">
          <LineChartLine size="small" />
          <span aria-hidden>{matomoStats?.nb_visits ?? 0}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>{t("matomo.popoverTitle")}</PopoverTitle>
        {!!matomoStats && (
          <UnOrderedList>
            <li>{t("matomo.visits", { count: matomoStats.nb_visits })}</li>
            <li>{t("matomo.hits", { count: matomoStats.nb_hits })}</li>
            <li>{t("matomo.avgTime", { time: matomoStats.avg_time_on_page })}</li>
          </UnOrderedList>
        )}
      </PopoverContent>
    </PopoverRoot>
  );
};

export default MatomoStats;
