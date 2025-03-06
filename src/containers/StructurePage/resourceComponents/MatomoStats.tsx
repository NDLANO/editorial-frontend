/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { LineChartLine } from "@ndla/icons";
import { Text, Skeleton, PopoverRoot, PopoverTrigger, PopoverContent, Button } from "@ndla/primitives";
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

  return matomoStats ? (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          size="small"
          variant="secondary"
          aria-label={t("matomo.popoverTitle", { count: matomoStats.nb_visits })}
          title={t("matomo.popoverTitle", { count: matomoStats.nb_visits })}
        >
          <Fragment aria-hidden>
            <LineChartLine size="small" />
            {matomoStats.nb_visits}
          </Fragment>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Text textStyle="body.small">{t("matomo.visits", { count: matomoStats.nb_visits })}</Text>
        <Text textStyle="body.small">{t("matomo.hits", { count: matomoStats.nb_hits })}</Text>
        <Text textStyle="body.small">{t("matomo.avgTime", { time: matomoStats.avg_time_on_page })}</Text>
      </PopoverContent>
    </PopoverRoot>
  ) : null;
};

export default MatomoStats;
