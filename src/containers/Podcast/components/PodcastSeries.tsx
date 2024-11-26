/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ComboboxLabel, Text } from "@ndla/primitives";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormField } from "../../../components/FormField";
import { useSearchSeries } from "../../../modules/audio/audioQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";

const PodcastSeries = () => {
  const { t, i18n } = useTranslation();
  const { query, delayedQuery, page, setPage, setQuery } = usePaginatedQuery();

  const searchQuery = useSearchSeries(
    {
      query: delayedQuery,
      page: page,
    },
    { placeholderData: (prev) => prev },
  );

  return (
    <FormField name="series">
      {({ field, helpers }) => (
        <div>
          <GenericSearchCombobox
            items={searchQuery.data?.results ?? []}
            itemToString={(item) => item.title.title}
            itemToValue={(item) => item.id.toString()}
            inputValue={query}
            isSuccess={searchQuery.isSuccess}
            paginationData={searchQuery.data}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            onPageChange={(details) => setPage(details.page)}
            value={field.value ? [field.value.id.toString()] : []}
            onValueChange={(details) => {
              const series = details.items[0];
              if (!series) return;
              // Delete episodes from series object, keep remaining
              const { episodes: _, ...remaining } = series;
              helpers.setValue(remaining);
            }}
            renderItem={(item) => (
              <GenericComboboxItemContent
                title={item.title.title}
                description={item.description.description}
                image={item.coverPhoto}
                useFallbackImage
              />
            )}
          >
            <ComboboxLabel>{t("podcastForm.fields.series")}</ComboboxLabel>
            <GenericComboboxInput
              placeholder={t("form.content.relatedArticle.placeholder")}
              isFetching={searchQuery.isFetching}
            />
          </GenericSearchCombobox>
          {field.value ? (
            <ListResource
              title={field.value.title.title}
              url={routes.podcastSeries.edit(field.value.id, i18n.language)}
              metaImage={field.value.coverPhoto}
              onDelete={() => helpers.setValue(null, true)}
              removeElementTranslation={t("podcastForm.information.removeSeries")}
            />
          ) : (
            <Text>{t("podcastForm.information.noSeries")}</Text>
          )}
        </div>
      )}
    </FormField>
  );
};

export default PodcastSeries;
