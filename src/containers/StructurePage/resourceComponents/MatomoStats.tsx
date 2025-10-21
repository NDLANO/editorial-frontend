/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
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
  stats: ResourceStats | undefined;
  allStats: (ResourceStats | undefined)[];
  isPending: boolean;
  isError: boolean;
}
const MatomoStats = ({ stats, allStats, isPending, isError }: Props) => {
  const { t } = useTranslation();

  if (isError) {
    return (
      <Text textStyle="body.small" color="text.error">
        {t("matomo.error")}
      </Text>
    );
  }

  if (isPending) {
    return (
      <Skeleton css={{ width: "xxlarge" }}>
        <Text textStyle="body.small">&nbsp;</Text>
      </Skeleton>
    );
  }

  const totalHits = allStats?.reduce((acc, curr) => acc + (curr?.nb_hits ?? 0), 0);

  return (
    <PopoverRoot>
      <PopoverTrigger
        asChild
        disabled={!stats}
        aria-label={stats ? t("matomo.popoverDescription", { count: stats.nb_hits }) : t("matomo.noData")}
        title={stats ? t("matomo.popoverDescription", { count: stats.nb_hits }) : t("matomo.noData")}
      >
        <Button size="small" variant="secondary">
          <LineChartLine size="small" />
          <span aria-hidden>{stats?.nb_hits ?? 0}</span>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverTitle>{t("matomo.popoverTitle")}</PopoverTitle>
          {!!stats && (
            <UnOrderedList>
              <li>{t("matomo.hits", { count: stats.nb_hits })}</li>
              <li>{t("matomo.visits", { count: stats.nb_visits })}</li>
              <li>{t("matomo.avgTime", { time: stats.avg_time_on_page })}</li>
              <li>{t("matomo.totalHits", { count: totalHits, contexts: allStats?.length })}</li>
            </UnOrderedList>
          )}
        </PopoverContent>
      </Portal>
    </PopoverRoot>
  );
};

export default MatomoStats;
