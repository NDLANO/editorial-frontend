/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageContainer } from "@ndla/primitives";
import NdlaFilmForm from "./components/NdlaFilmForm";
import { PageSpinner } from "../../components/PageSpinner";
import config from "../../config";
import { isValidLocale } from "../../i18n";
import { useFilmFrontpageQuery } from "../../modules/frontpage/filmQueries";
import NotFound from "../NotFoundPage/NotFoundPage";

const NdlaFilmEditor = () => {
  const filmFrontpageQuery = useFilmFrontpageQuery();
  const { selectedLanguage } = useParams<"selectedLanguage">();
  const selectedLangOrDefault = selectedLanguage ?? config.defaultLanguage;
  const { t } = useTranslation();

  if (!isValidLocale(selectedLangOrDefault)) {
    return <NotFound />;
  }

  if (!filmFrontpageQuery.data) {
    return <PageSpinner />;
  }

  return (
    <PageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.ndlaFilmPage")}</title>
        <NdlaFilmForm filmFrontpage={filmFrontpageQuery.data} selectedLanguage={selectedLangOrDefault} />
      </main>
    </PageContainer>
  );
};

export default NdlaFilmEditor;
