/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ArticleRevisionHistoryDTO, IArticleDTO, IStatusDTO } from "@ndla/types-backend/draft-api";
import { TaxonomyContext } from "@ndla/types-taxonomy";
import HeaderActions from "./HeaderActions";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import HeaderInformation from "./HeaderInformation";

export type FormHeaderType = "topic-article" | "standard" | "frontpage-article";

interface Props {
  title?: string;
  language: string;
  id?: number;
  taxonomy?: TaxonomyContext[];
  noStatus?: boolean;
  article?: IArticleDTO;
  articleRevisionHistory?: ArticleRevisionHistoryDTO;
  supportedLanguages: string[];
  type: FormHeaderType;
  status?: IStatusDTO;
  expirationDate?: string;
}

const HeaderWithLanguage = ({
  noStatus = false,
  type,
  taxonomy = [],
  article,
  articleRevisionHistory,
  id,
  language,
  status,
  expirationDate,
  supportedLanguages,
  title,
}: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();

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
        taxonomy={taxonomy}
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
          isSubmitting={isSubmitting}
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
