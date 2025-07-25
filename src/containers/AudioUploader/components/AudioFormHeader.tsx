/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import { IConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { ContentTypeBadge } from "@ndla/ui";
import EmbedConnection from "../../../components/HeaderWithLanguage/EmbedInformation/EmbedConnection";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderSegment,
  FormHeaderStatusWrapper,
} from "../../FormHeader/FormHeader";

interface Props {
  audio: IAudioMetaInformationDTO | undefined;
  language: string;
}

export const AudioFormHeader = ({ audio, language }: Props) => {
  const { t } = useTranslation();
  // true by default to disable language deletions until connections are retrieved.
  const [hasConnections, setHasConnections] = useState(true);
  const [articles, setArticles] = useState<IMultiSearchSummaryDTO[]>([]);
  const [concepts, setConcepts] = useState<IConceptSummaryDTO[]>([]);
  const isNewLanguage = !!audio?.id && !audio?.supportedLanguages.includes(language);

  useEffect(() => {
    setHasConnections(!!articles.length || !!concepts.length);
  }, [articles, concepts, setHasConnections]);

  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <ContentTypeBadge contentType="audio" />
          <FormHeaderHeading contentType="audio">{audio?.title.title}</FormHeaderHeading>
        </FormHeaderHeadingContainer>
        <FormHeaderStatusWrapper>
          <HeaderFavoriteStatus id={audio?.id} type="audio" />
          <EmbedConnection
            id={audio?.id}
            type="audio"
            articles={articles}
            setArticles={setArticles}
            concepts={concepts}
            setConcepts={setConcepts}
          />
        </FormHeaderStatusWrapper>
      </FormHeaderSegment>
      {audio?.id ? (
        <HeaderActions
          id={audio.id}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={audio.supportedLanguages}
          disableDelete={!!hasConnections && audio.supportedLanguages.length === 1}
          noStatus
          isNewLanguage={isNewLanguage}
          type="audio"
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};
