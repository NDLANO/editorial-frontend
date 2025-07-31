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
import { ComboboxLabel, FieldRoot } from "@ndla/primitives";
import { IArticleV2DTO } from "@ndla/types-backend/article-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { getArticle } from "../../../modules/article/articleApi";
import { useSearchResources } from "../../../modules/search/searchQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { getIdFromUrn, getUrnFromId } from "../ndlaFilmHelpers";

interface Props {
  fieldName: string;
}

const NdlaFilmArticle = ({ fieldName }: Props) => {
  const { t } = useTranslation();
  const [field, , helpers] = useField<string | undefined>(fieldName);
  const [selectedArticle, setSelectedArticle] = useState<undefined | IArticleV2DTO>(undefined);
  const { query, page, setPage, delayedQuery, setQuery } = usePaginatedQuery();

  const searchQuery = useSearchResources(
    { articleTypes: ["frontpage-article"], page, query: delayedQuery },
    { placeholderData: (prev) => prev },
  );

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
        itemToValue={(item) => getUrnFromId(item.id)}
        inputValue={query}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        value={field.value ? [field.value.toString()] : []}
        onValueChange={(details) => {
          const newValue = details.value[0];
          if (!newValue) return;
          if (field.value === newValue) {
            helpers.setValue(undefined);
          } else {
            helpers.setValue(newValue);
          }
        }}
        selectionBehavior="preserve"
        closeOnSelect={false}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            description={item.metaDescription?.metaDescription}
            image={item.metaImage}
            useFallbackImage
          />
        )}
      >
        <ComboboxLabel>{t("ndlaFilm.editor.moreInfoTitle")}</ComboboxLabel>
        <GenericComboboxInput placeholder={t("frontpageForm.search")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      {!!selectedArticle && !!field.value && (
        <ListResource
          title={selectedArticle.title.title}
          metaImage={selectedArticle.metaImage}
          url={routes.frontpage.edit(selectedArticle.id, selectedArticle.title.language)}
          onDelete={() => helpers.setValue(undefined)}
          removeElementTranslation={t("ndlaFilm.editor.removeArticleFromMoreInformation")}
        />
      )}
    </FieldRoot>
  );
};

export default NdlaFilmArticle;
