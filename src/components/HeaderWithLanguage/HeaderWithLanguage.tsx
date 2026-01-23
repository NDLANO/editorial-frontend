/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ArticleRevisionHistoryDTO, ArticleDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import HeaderActions from "./HeaderActions";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import HeaderInformation from "./HeaderInformation";
import { getExpirationDate } from "../../util/revisionHelpers";

export type FormHeaderType = "topic-article" | "standard" | "frontpage-article";

interface Props {
  language: string;
  article?: ArticleDTO;
  articleRevisionHistory?: ArticleRevisionHistoryDTO;
  type: FormHeaderType;
  nodes: Node[] | undefined;
}

const HeaderWithLanguage = ({ type, article, articleRevisionHistory, language, nodes }: Props) => {
  const { t } = useTranslation();

  const isNewLanguage = !!article && !article.supportedLanguages.includes(language);
  const statusText = article?.status?.current ? t(`form.status.${article.status.current.toLowerCase()}`) : "";
  const published = article?.status?.current === "PUBLISHED" || article?.status?.other?.includes("PUBLISHED");

  return (
    <header>
      <HeaderInformation
        type={type}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={article?.title?.title}
        id={article?.id}
        published={published}
        expirationDate={getExpirationDate(article?.revisions)}
        responsibleId={article?.responsible?.responsibleId}
        language={language}
        slug={article?.slug}
        traits={article?.traits}
        nodes={nodes}
      />
      {article ? (
        <HeaderActions
          id={article.id}
          articleRevisionHistory={articleRevisionHistory}
          language={language}
          supportedLanguages={article.supportedLanguages}
          disableDelete={article.supportedLanguages.length === 1}
          article={article}
          noStatus={false}
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
