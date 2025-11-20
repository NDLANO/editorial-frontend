/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ArticleRevisionHistoryDTO, ArticleDTO, StatusDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import HeaderActions from "./HeaderActions";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import HeaderInformation from "./HeaderInformation";

export type FormHeaderType = "topic-article" | "standard" | "frontpage-article";

interface Props {
  title?: string;
  language: string;
  id?: number;
  noStatus?: boolean;
  article?: ArticleDTO;
  articleRevisionHistory?: ArticleRevisionHistoryDTO;
  supportedLanguages: string[];
  type: FormHeaderType;
  status?: StatusDTO;
  expirationDate?: string;
  nodes: Node[] | undefined;
}

const HeaderWithLanguage = ({
  noStatus = false,
  type,
  article,
  articleRevisionHistory,
  id,
  language,
  status,
  expirationDate,
  supportedLanguages,
  title,
  nodes,
}: Props) => {
  const { t } = useTranslation();

  const isNewLanguage = !!id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : "";
  const published = status?.current === "PUBLISHED" || status?.other?.includes("PUBLISHED");

  return (
    <header>
      <HeaderInformation
        type={type}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        id={id}
        published={published}
        expirationDate={expirationDate}
        responsibleId={article?.responsible?.responsibleId}
        language={language}
        slug={article?.slug}
        traits={article?.traits}
        nodes={nodes}
      />
      {id ? (
        <HeaderActions
          id={id}
          articleRevisionHistory={articleRevisionHistory}
          language={language}
          supportedLanguages={supportedLanguages}
          disableDelete={supportedLanguages.length === 1}
          article={article}
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
