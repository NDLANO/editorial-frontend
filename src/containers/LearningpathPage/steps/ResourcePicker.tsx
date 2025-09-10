/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { t } from "i18next";
import { debounce } from "lodash-es";
import { useState, useMemo, ReactNode } from "react";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { constants, ContentTypeBadge } from "@ndla/ui";
import { ResourceData } from "./types";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import {
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from "../../../constants";
import { useSearch, useSearchResources } from "../../../modules/search/searchQueries";

const { contentTypes } = constants;

export const contentTypeMapping: Record<string, string> = {
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: contentTypes.SUBJECT_MATERIAL,

  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: contentTypes.TASKS_AND_ACTIVITIES,

  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: contentTypes.ASSESSMENT_RESOURCES,

  [RESOURCE_TYPE_SOURCE_MATERIAL]: contentTypes.SOURCE_MATERIAL,

  default: contentTypes.SUBJECT_MATERIAL,
};

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

interface Props {
  setResource: (data: ResourceData) => void;
  onlyPublishedResources: boolean;
  children?: ReactNode;
}

const DEFAULT_SEARCH_OBJECT = { page: 1, pageSize: 10, query: "" };

export const ResourcePicker = ({ setResource, children, onlyPublishedResources }: Props) => {
  const [searchObject, setSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const [delayedSearchObject, setDelayedSearchObject] = useState(DEFAULT_SEARCH_OBJECT);

  const searchFunc = onlyPublishedResources ? useSearchResources : useSearch;

  const searchQuery = searchFunc({
    query: delayedSearchObject.query,
    page: delayedSearchObject.page,
    pageSize: delayedSearchObject.pageSize,
    resourceTypes: [
      RESOURCE_TYPE_SUBJECT_MATERIAL,
      RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
      RESOURCE_TYPE_ASSESSMENT_RESOURCES,
      RESOURCE_TYPE_SOURCE_MATERIAL,
    ],
  });

  const searchHits = useMemo(() => {
    return (
      searchQuery.data?.results.map((result) => {
        const context = result.contexts.find((context) => context.isPrimary) ?? result.contexts[0];
        const contentType = contentTypeMapping?.[context?.resourceTypes?.[0]?.id ?? "default"];
        return {
          ...result,
          id: result.id.toString(),
          resourceType: contentType,
          contentType,
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [searchQuery.data?.results]);

  const onQueryChange = (val: string) => {
    setSearchObject({ query: val, page: 1, pageSize: 10 });
    debounceCall(() => setDelayedSearchObject({ query: val, page: 1, pageSize: 10 }));
  };

  const onResourceSelect = async (resource: Omit<IMultiSearchSummaryDTO, "id"> & { id: string }) => {
    setResource({
      articleId: parseInt(resource.id),
      articleType: resource.learningResourceType,
      title: resource.title.title,
      resourceTypes: resource.contexts?.[0]?.resourceTypes,
      breadcrumbs: resource.contexts?.[0]?.breadcrumbs,
    });
  };

  return (
    <GenericSearchCombobox
      items={searchHits}
      itemToString={(item) => item.title.title}
      itemToValue={(item) => item.id}
      onValueChange={(details) => {
        if (details.items[0]) {
          onResourceSelect(details.items[0]);
        }
      }}
      paginationData={searchQuery.data}
      inputValue={searchObject.query}
      isSuccess={searchQuery.isSuccess}
      onInputValueChange={(details) => onQueryChange(details.inputValue)}
      onPageChange={(details) => {
        setSearchObject((prev) => ({ ...prev, page: details.page }));
        setDelayedSearchObject((prev) => ({ ...prev, page: details.page }));
      }}
      closeOnSelect={false}
      selectionBehavior="preserve"
      renderItem={(item) => (
        <GenericComboboxItemContent
          title={parse(item.title.htmlTitle)}
          description={item.contexts[0]?.breadcrumbs.join(" > ")}
          child={<ContentTypeBadge contentType={item.contentType} />}
        />
      )}
      positioning={{ strategy: "fixed" }}
    >
      {children}
      <GenericComboboxInput placeholder={t("searchPage.search")} isFetching={searchQuery.isFetching} />
    </GenericSearchCombobox>
  );
};
