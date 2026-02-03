/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BroadcastLine, VoiceprintLine } from "@ndla/icons";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { AudioSummaryDTO } from "@ndla/types-backend/audio-api";
import { LicenseLink } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { routes } from "../../../../util/routeHelpers";
import { SearchContentWrapper } from "./SearchContentWrapper";

interface Props {
  audio: AudioSummaryDTO;
}

const SearchAudio = ({ audio }: Props) => {
  const { t, i18n } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => audio.license === l.license);

  return (
    <ListItemRoot data-testid="audio-search-result">
      <ListItemImage
        fallbackElement={audio.audioType === "podcast" ? <BroadcastLine /> : <VoiceprintLine />}
        src=""
        alt=""
      />
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
        {!!license && <LicenseLink license={getLicenseByAbbreviation(license?.license, i18n.language)} />}
      </ListItemContent>
    </ListItemRoot>
  );
};

export default SearchAudio;
