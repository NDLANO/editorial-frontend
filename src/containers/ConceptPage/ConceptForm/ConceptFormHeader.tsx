/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@ndla/primitives";
import { IConceptDTO } from "@ndla/types-backend/concept-api";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import EmbedConnection from "../../../components/HeaderWithLanguage/EmbedInformation/EmbedConnection";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import { ResourcePublishedLink } from "../../../components/HeaderWithLanguage/ResourcePublishedLink";
import { useAuth0Users } from "../../../modules/auth0/auth0Queries";
import { Plain } from "../../../util/slatePlainSerializer";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderResponsibleInfo,
  FormHeaderSegment,
  FormHeaderStatusInfo,
  FormHeaderStatusWrapper,
} from "../../FormHeader/FormHeader";

interface Props {
  concept: IConceptDTO | undefined;
  language: string;
  initialTitle: string | undefined;
  type: "gloss" | "concept";
}

export const ConceptFormHeader = ({ concept, language, initialTitle, type }: Props) => {
  const { t } = useTranslation();
  const [, titleField] = useField("title");
  const [, targetLanguageField] = useField("gloss.gloss");
  // true by default to disable language deletions until connections are retrieved.
  const [hasConnections, setHasConnections] = useState(true);
  const [articles, setArticles] = useState<IMultiSearchSummaryDTO[]>([]);

  const statusText = concept?.status?.current ? t(`form.status.${concept?.status.current.toLowerCase()}`) : "";
  const published = concept?.status?.current === "PUBLISHED" || concept?.status?.other?.includes("PUBLISHED");
  const isNewLanguage = !!concept?.id && !concept?.supportedLanguages.includes(language);

  useEffect(() => {
    setHasConnections(!!articles.length);
  }, [articles]);

  const responsibleQuery = useAuth0Users(
    { uniqueUserIds: concept?.responsible?.responsibleId ?? "" },
    { enabled: !!concept?.responsible?.responsibleId },
  );

  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <Badge>{t(`contentTypes.${type}`)}</Badge>
          <FormHeaderHeading contentType={type}>
            {!!(concept?.title.title ?? initialTitle) && type === "gloss"
              ? `${t("glossform.title")}: ${Plain.serialize(titleField.value)}${
                  targetLanguageField.value ? `/${targetLanguageField.value}` : ""
                }`
              : (concept?.title.title ?? initialTitle)}
          </FormHeaderHeading>
        </FormHeaderHeadingContainer>
        <FormHeaderStatusWrapper>
          <EmbedConnection id={concept?.id} type={type} articles={articles} setArticles={setArticles} />
          {!!published && !!concept?.id && <ResourcePublishedLink type="concept" slugOrId={concept.id} />}
          <HeaderFavoriteStatus id={concept?.id} type={type} />
          <div>
            <FormHeaderResponsibleInfo responsibleName={responsibleQuery.data?.[0]?.name} />
            <FormHeaderStatusInfo isNewLanguage={isNewLanguage} statusText={statusText} />
          </div>
        </FormHeaderStatusWrapper>
      </FormHeaderSegment>
      {concept?.id ? (
        <HeaderActions
          id={concept.id}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={concept.supportedLanguages}
          disableDelete={!!hasConnections && concept.supportedLanguages.length === 1}
          noStatus={false}
          concept={concept}
          isNewLanguage={isNewLanguage}
          type={type}
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};
