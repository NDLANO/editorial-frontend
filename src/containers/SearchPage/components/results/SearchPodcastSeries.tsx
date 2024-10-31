/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Podcast } from "@ndla/icons/common";
import { ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { ISeriesSummary } from "@ndla/types-backend/audio-api";
import { SearchContentWrapper } from "./SearchContentWrapper";
import { SearchListItemImage } from "./SearchListItemImage";
import { routes } from "../../../../util/routeHelpers";

interface Props {
  series: ISeriesSummary;
}

const SearchPodcastSeries = ({ series }: Props) => {
  const { t } = useTranslation();

  return (
    <ListItemRoot context="list" variant="subtle">
      <SearchListItemImage
        src={series.coverPhoto.url}
        alt={series.coverPhoto.altText}
        sizes="56px"
        fallbackWidth={56}
        fallbackElement={<Podcast />}
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
