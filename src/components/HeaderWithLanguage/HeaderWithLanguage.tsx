/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IConceptDTO } from "@ndla/types-backend/concept-api";
import { IArticleDTO, IStatusDTO } from "@ndla/types-backend/draft-api";
import { TaxonomyContext } from "@ndla/types-taxonomy";
import HeaderActions from "./HeaderActions";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import HeaderInformation from "./HeaderInformation";

export type FormHeaderType =
  | "image"
  | "audio"
  | "topic-article"
  | "standard"
  | "concept"
  | "gloss"
  | "podcast"
  | "podcast-series"
  | "frontpage-article";

interface Props {
  title?: string;
  language: string;
  id?: number;
  taxonomy?: TaxonomyContext[];
  noStatus?: boolean;
  article?: IArticleDTO;
  articleHistory?: IArticleDTO[];
  supportedLanguages: string[];
  concept?: IConceptDTO;
  type: FormHeaderType;
  hasRSS?: boolean;
  status?: IStatusDTO;
  expirationDate?: string;
}

const HeaderWithLanguage = ({
  noStatus = false,
  type,
  taxonomy = [],
  article,
  articleHistory,
  hasRSS,
  id,
  concept,
  language,
  status,
  expirationDate,
  supportedLanguages,
  title,
}: Props) => {
  const { t } = useTranslation();

  // true by default to disable language deletions until connections are retrieved.
  const [hasConnections, setHasConnections] = useState(true);

  const isNewLanguage = !!id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : "";
  const published = status?.current === "PUBLISHED" || status?.other?.includes("PUBLISHED");
  const isArticle = type === "standard" || type === "topic-article" || type === "frontpage-article";
  const responsible = isArticle ? article?.responsible?.responsibleId : concept?.responsible?.responsibleId;

  return (
    <header>
      <HeaderInformation
        type={type}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        id={id}
        published={published}
        setHasConnections={setHasConnections}
        expirationDate={expirationDate}
        responsibleId={responsible}
        hasRSS={hasRSS}
        language={language}
        slug={article?.slug}
        taxonomy={taxonomy}
      />
      {id ? (
        <HeaderActions
          id={id}
          articleHistory={articleHistory}
          language={language}
          supportedLanguages={supportedLanguages}
          disableDelete={!!(hasConnections || isArticle) && supportedLanguages.length === 1}
          article={article}
          concept={concept}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          type={type}
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};

export default memo(HeaderWithLanguage);
