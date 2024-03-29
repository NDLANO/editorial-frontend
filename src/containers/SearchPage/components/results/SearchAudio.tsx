/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Audio, Podcast } from "@ndla/icons/common";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { IAudioSummary } from "@ndla/types-backend/audio-api";
import { LicenseLink } from "@ndla/ui";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { toEditAudio, toEditPodcast } from "../../../../util/routeHelpers";
import {
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchOtherLink,
  StyledSearchResult,
  StyledSearchTitle,
} from "../form/StyledSearchComponents";

interface Props {
  audio: IAudioSummary;
  locale: string;
}

const SearchAudio = ({ audio, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => audio.license === l.license);
  return (
    <StyledSearchResult data-testid="audio-search-result">
      <StyledSearchImageContainer>{audio.audioType === "podcast" ? <Podcast /> : <Audio />}</StyledSearchImageContainer>
      <StyledSearchContent>
        <Link
          to={
            audio.audioType === "podcast"
              ? toEditPodcast(audio.id, audio.title.language)
              : toEditAudio(audio.id, audio.title.language)
          }
        >
          <StyledSearchTitle>{audio.title.title || t("audioSearch.noTitle")}</StyledSearchTitle>
        </Link>
        <StyledSearchDescription>
          {`${t("searchPage.language")}: `}
          {audio.supportedLanguages?.map((lang) => (
            <StyledSearchOtherLink key={lang}>{t(`languages.${lang}`)}</StyledSearchOtherLink>
          ))}
        </StyledSearchDescription>
        {license && <LicenseLink license={getLicenseByAbbreviation(license.license, locale)} />}
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchAudio;
