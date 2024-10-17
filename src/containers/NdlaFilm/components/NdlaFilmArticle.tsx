/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxLabel, FieldHelper, FieldRoot } from "@ndla/primitives";
import { IArticleV2 } from "@ndla/types-backend/article-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { getArticle } from "../../../modules/article/articleApi";
import { useArticleSearch } from "../../../modules/article/articleQueries";
import { getUrnFromId, getIdFromUrn } from "../../../util/ndlaFilmHelpers";
import { routes } from "../../../util/routeHelpers";
import useDebounce from "../../../util/useDebounce";

interface Props {
  fieldName: string;
}

const NdlaFilmArticle = ({ fieldName }: Props) => {
  const { t } = useTranslation();
  const [field, _, helpers] = useField<string | null>(fieldName);
  const [selectedArticle, setSelectedArticle] = useState<undefined | IArticleV2>(undefined);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const delayedQuery = useDebounce(query, 300);

  const searchQuery = useArticleSearch({
    articleTypes: ["frontpage-article"],
    page,
    query: delayedQuery,
  });

  useEffect(() => {
    const initSelectedArticle = async () => {
      if (field.value) {
        const response = await getArticle(getIdFromUrn(field.value));
        setSelectedArticle(response);
      } else {
        setSelectedArticle(undefined);
      }
    };
    initSelectedArticle();
  }, [field.value]);

  return (
    <FieldRoot>
      <GenericSearchCombobox
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => getUrnFromId(item.id.toString())}
        inputValue={query}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        value={field.value ? [field.value?.toString()] : undefined}
        onValueChange={(details) => helpers.setValue(getUrnFromId(details.items[0].id))}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            description={item.metaDescription?.metaDescription}
            image={item.metaImage}
          />
        )}
      >
        <ComboboxLabel>{t("ndlaFilm.editor.moreInfoTitle")}</ComboboxLabel>
        <FieldHelper>{t("ndlaFilm.editor.moreInfoSubTitle")}</FieldHelper>
        <GenericComboboxInput placeholder={t("frontpageForm.search")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      {!!selectedArticle && (
        <ListResource
          title={selectedArticle.title.title}
          metaImage={selectedArticle.metaImage}
          url={routes.frontpage.edit(selectedArticle.id, selectedArticle.title.language)}
          onDelete={() => helpers.setValue(null)}
          removeElementTranslation={t("ndlaFilm.editor.removeArticleFromMoreInformation")}
        />
      )}
    </FieldRoot>
  );
};

export default NdlaFilmArticle;
