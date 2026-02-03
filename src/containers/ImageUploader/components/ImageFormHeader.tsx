/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Badge } from "@ndla/primitives";
import { ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloneImageDialog } from "../../../components/HeaderWithLanguage/CloneImageDialog";
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
  image: ImageMetaInformationV3DTO | undefined;
  language: string;
}

export const ImageFormHeader = ({ image, language }: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!image?.id && !image.supportedLanguages.includes(language);
  const parsedId = image?.id ? parseInt(image.id) : undefined;

  // true by default to disable language deletions until connections are retrieved.
  const [hasConnections, setHasConnections] = useState(true);
  const [articles, setArticles] = useState<MultiSearchSummaryDTO[]>([]);
  const [concepts, setConcepts] = useState<ConceptSummaryDTO[]>([]);

  useEffect(() => {
    setHasConnections(!!articles.length || !!concepts.length);
  }, [articles, concepts, setHasConnections]);

  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <Badge>{t("contentTypes.image")}</Badge>
          <FormHeaderHeading contentType="image">{image?.title.title}</FormHeaderHeading>
          {!!parsedId && <CloneImageDialog imageId={parsedId} />}
        </FormHeaderHeadingContainer>
        {!isNewLanguage && (
          <FormHeaderStatusWrapper>
            <HeaderFavoriteStatus id={parsedId} type="image" />
            <EmbedConnection
              id={parsedId}
              type="image"
              articles={articles}
              setArticles={setArticles}
              concepts={concepts}
              setConcepts={setConcepts}
            />
          </FormHeaderStatusWrapper>
        )}
      </FormHeaderSegment>
      {image && parseInt(image.id) ? (
        <HeaderActions
          id={parseInt(image.id)}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={image.supportedLanguages}
          disableDelete={!!hasConnections && image.supportedLanguages.length === 1}
          noStatus
          isNewLanguage={isNewLanguage}
          type="image"
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};
