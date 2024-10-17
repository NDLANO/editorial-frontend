/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Audio, Podcast } from "@ndla/icons/common";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { IAudioSummary } from "@ndla/types-backend/audio-api";
import { LicenseLink } from "@ndla/ui";
import { SearchContentWrapper } from "./SearchContentWrapper";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { routes } from "../../../../util/routeHelpers";

interface Props {
  audio: IAudioSummary;
  locale: string;
}

const SearchAudio = ({ audio, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => audio.license === l.license);

  return (
    <ListItemRoot context="list" variant="subtle" data-testid="audio-search-result">
      <ListItemImage fallbackElement={audio.audioType === "podcast" ? <Podcast /> : <Audio />} src="" alt="" />
      <ListItemContent>
        <SearchContentWrapper>
          <ListItemHeading asChild consumeCss>
            <SafeLink
              to={
                audio.audioType === "podcast"
                  ? routes.podcast.edit(audio.id, audio.title.language)
                  : routes.audio.edit(audio.id, audio.title.language)
              }
              unstyled
            >
              {audio.title.title || t("audioSearch.noTitle")}
            </SafeLink>
          </ListItemHeading>
        </SearchContentWrapper>
        {!!license && <LicenseLink license={getLicenseByAbbreviation(license?.license, locale)} />}
      </ListItemContent>
    </ListItemRoot>
  );
};

export default SearchAudio;
