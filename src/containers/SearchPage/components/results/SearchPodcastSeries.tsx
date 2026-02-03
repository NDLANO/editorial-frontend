/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BroadcastLine } from "@ndla/icons";
import { ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { SeriesSummaryDTO } from "@ndla/types-backend/audio-api";
import { useTranslation } from "react-i18next";
import { routes } from "../../../../util/routeHelpers";
import { SearchContentWrapper } from "./SearchContentWrapper";
import { SearchListItemImage } from "./SearchListItemImage";

interface Props {
  series: SeriesSummaryDTO;
}

const SearchPodcastSeries = ({ series }: Props) => {
  const { t } = useTranslation();

  return (
    <ListItemRoot>
      <SearchListItemImage
        src={series.coverPhoto.url}
        alt={series.coverPhoto.altText}
        sizes="56px"
        fallbackWidth={56}
        fallbackElement={<BroadcastLine />}
      />
      <ListItemContent>
        <SearchContentWrapper>
          <ListItemHeading asChild consumeCss>
            <SafeLink to={routes.podcastSeries.edit(series.id, series.title.language)} unstyled>
              {series.title.title || t("podcastSearch.noTitle")}
            </SafeLink>
          </ListItemHeading>
        </SearchContentWrapper>
      </ListItemContent>
    </ListItemRoot>
  );
};

export default SearchPodcastSeries;
