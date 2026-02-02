/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Badge } from "@ndla/primitives";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { constants } from "@ndla/ui";
import parse from "html-react-parser";
import { debounce } from "lodash-es";
import { useState, useMemo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BadgesContainer } from "@ndla/ui";
import { ResourceData } from "./types";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import {
  PUBLISHED,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_GAME,
} from "../../../constants";
import { useSearch } from "../../../modules/search/searchQueries";
import { ResourceData } from "./types";
import { getBadges } from "../../../util/getBadges";

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

interface Props {
  setResource: (data: ResourceData) => void;
  onlyPublishedResources?: boolean;
  children?: ReactNode;
}

const DEFAULT_SEARCH_OBJECT = { page: 1, pageSize: 10, query: "" };

export const ResourcePicker = ({ setResource, children, onlyPublishedResources }: Props) => {
  const { t } = useTranslation();
  const [searchObject, setSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const [delayedSearchObject, setDelayedSearchObject] = useState(DEFAULT_SEARCH_OBJECT);

  const searchQuery = useSearch({
    query: delayedSearchObject.query,
    page: delayedSearchObject.page,
    pageSize: delayedSearchObject.pageSize,
    resultTypes: ["draft", "concept", "learningpath"],
    resourceTypes: [
      RESOURCE_TYPE_SUBJECT_MATERIAL,
      RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
      RESOURCE_TYPE_ASSESSMENT_RESOURCES,
      RESOURCE_TYPE_SOURCE_MATERIAL,
      RESOURCE_TYPE_CONCEPT,
      RESOURCE_TYPE_GAME,
    ],
  });

  const searchHits = useMemo(() => {
    return (
      searchQuery.data?.results.map((result) => {
        const context = result.contexts.find((context) => context.isPrimary) ?? result.contexts[0];
        return {
          ...result,
          id: result.id.toString(),
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [searchQuery.data?.results]);

  const onQueryChange = (val: string) => {
    setSearchObject({ query: val, page: 1, pageSize: 10 });
    debounceCall(() => setDelayedSearchObject({ query: val, page: 1, pageSize: 10 }));
  };

  const onResourceSelect = async (resource: Omit<MultiSearchSummaryDTO, "id"> & { id: string }) => {
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
      isItemDisabled={(item) => {
        const hasPublished = item.status?.current === PUBLISHED || item.status?.other.includes(PUBLISHED);
        return onlyPublishedResources ? !hasPublished : false;
      }}
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
      renderItem={(item) => {
        const badges = getBadges({ resourceTypes: item.resourceTypes }, t);
        return (
          <GenericComboboxItemContent
            title={parse(item.title.htmlTitle)}
            description={item.contexts[0]?.breadcrumbs.join(" > ")}
            child={
              <BadgesContainer>
                {badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </BadgesContainer>
            }
          />
        );
      }}
      positioning={{ strategy: "fixed" }}
    >
      {children}
      <GenericComboboxInput placeholder={t("searchPage.search")} isFetching={searchQuery.isFetching} />
    </GenericSearchCombobox>
  );
};
