/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import sortBy from "lodash/sortBy";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Node } from "@ndla/types-taxonomy";
import GenericSearchForm, { OnFieldChangeFunction } from "./GenericSearchForm";
import { SearchParams } from "./SearchForm";
import { SearchFormSelector } from "./Selector";
import {
  DRAFT_RESPONSIBLE,
  FAVOURITES_SUBJECT_ID,
  LMA_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
} from "../../../../constants";
import { useAuth0Editors, useAuth0Responsibles } from "../../../../modules/auth0/auth0Queries";
import { useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { useAllResourceTypes } from "../../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { getTagName } from "../../../../util/formHelper";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import { flattenResourceTypesAndAddContextTypes } from "../../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const generateSubjectNode = (id: string, name: string, t: TFunction): Node => ({
  id: id,
  breadcrumbs: [],
  contexts: [],
  paths: [],
  resourceTypes: [],
  supportedLanguages: [],
  translations: [],
  nodeType: "SUBJECT",
  baseName: t(name),
  name: t(name),
  contentUri: "",
  path: "",
  language: "",
  metadata: {
    customFields: {},
    grepCodes: [],
    visible: true,
  },
});

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
  userId: string | undefined;
}

const SearchContentForm = ({ search: doSearch, searchObject: search, subjects, locale, userId }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [queryInput, setQueryInput] = useState(search.query ?? "");
  const [isHasPublished, setIsHasPublished] = useState(false);

  const { data: users } = useAuth0Editors({
    select: (users) => users.map((u) => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  const { data: responsibles } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) =>
        sortBy(
          users.map((u) => ({
            id: `${u.app_metadata.ndla_id}`,
            name: u.name,
          })),
          (u) => u.name,
        ),
      placeholderData: [],
    },
  );

  const { data: resourceTypes } = useAllResourceTypes(
    { language: locale, taxonomyVersion },
    {
      select: (resourceTypes) => flattenResourceTypesAndAddContextTypes(resourceTypes, t),
      placeholderData: [],
    },
  );

  useEffect(() => {
    if (search.query !== queryInput) {
      setQueryInput(search.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.query]);

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    let includeOtherStatuses: boolean | undefined;
    let status: string | undefined;
    if (name === "query" && evt) setQueryInput(evt.currentTarget.value);
    if (name === "draft-status" && typeof value === "string") {
      const isHasPublished = value === "HAS_PUBLISHED";
      includeOtherStatuses = isHasPublished;
      setIsHasPublished(isHasPublished);
      status = isHasPublished ? "PUBLISHED" : value;
    } else {
      includeOtherStatuses = search["include-other-statuses"];
      status = search.status;
    }
    const searchObj = {
      ...search,
      "include-other-statuses": includeOtherStatuses,
      [name]: value,
    };

    if (name !== "query") {
      doSearch(name !== "draft-status" ? searchObj : { ...searchObj, "draft-status": status, fallback: false });
    }
  };

  const handleSearch = () => {
    doSearch({ ...search, fallback: false, page: 1, query: queryInput });
  };

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    if (tag.parameterName === "draft-status") setIsHasPublished(tag.value === "HAS_PUBLISHED");
    doSearch({ ...search, [tag.parameterName]: "" });
  };

  const emptySearch = () => {
    setIsHasPublished(false);
    setQueryInput("");
    doSearch({
      query: "",
      subjects: "",
      "resource-types": "",
      "draft-status": "",
      users: "",
      language: "",
      "revision-date-from": "",
      "revision-date-to": "",
      "exclude-revision-log": false,
      "responsible-ids": "",
      "filter-inactive": true,
    });
  };

  const { data: statuses } = useDraftStatusStateMachine();

  const getDraftStatuses = (): { id: string; name: string }[] => {
    return [
      ...Object.keys(statuses || []).map((s) => {
        return { id: s, name: t(`form.status.${s.toLowerCase()}`) };
      }),
      { id: "HAS_PUBLISHED", name: t(`form.status.has_published`) },
    ];
  };

  const sortByProperty = (property: string) => {
    type Sortable = { [key: string]: any };
    return (a: Sortable, b: Sortable) => a[property]?.localeCompare(b[property]);
  };

  const sortedSubjects = useMemo(() => {
    const favoriteSubject: Node = generateSubjectNode(FAVOURITES_SUBJECT_ID, "searchForm.favourites", t);

    const userHasLMASubjects = subjects.some((s) => s.metadata.customFields?.subjectLMA === userId);

    const LMAsubjects: Node = generateSubjectNode(LMA_SUBJECT_ID, "searchForm.LMASubjects", t);

    const filteredAndSortedSubjects = subjects
      .filter((s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true")
      .sort(sortByProperty("name"));
    return [favoriteSubject, ...(userHasLMASubjects ? [LMAsubjects] : [])].concat(filteredAndSortedSubjects);
  }, [subjects, t, userId]);

  const selectors: SearchFormSelector[] = [
    {
      value: getTagName(search.subjects, sortedSubjects),
      parameterName: "subjects",
      width: 25,
      options: sortedSubjects,
      formElementType: "dropdown",
    },
    {
      value: getTagName(search["resource-types"], resourceTypes),
      parameterName: "resource-types",
      width: 25,
      options: resourceTypes!.sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(search["responsible-ids"], responsibles),
      parameterName: "responsible-ids",
      width: 25,
      options: responsibles!,
      formElementType: "dropdown",
    },
    {
      value: getTagName(isHasPublished ? "HAS_PUBLISHED" : search["draft-status"], getDraftStatuses()),
      parameterName: "draft-status",
      width: 25,
      options: getDraftStatuses().sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(search.users, users),
      parameterName: "users",
      width: 25,
      options: users!.sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(search.language, getResourceLanguages(t)),
      parameterName: "language",
      width: 25,
      options: getResourceLanguages(t),
      formElementType: "dropdown",
    },
    {
      value: search["filter-inactive"]?.toString(),
      parameterName: "filter-inactive",
      width: 25,
      formElementType: "check-box-reverse",
    },
    {
      value: search["exclude-revision-log"]?.toString(),
      parameterName: "exclude-revision-log",
      width: 25,
      formElementType: "check-box",
    },
  ];

  selectors.push(
    {
      value: search["revision-date-from"],
      parameterName: "revision-date-from",
      width: 25,
      formElementType: "date-picker",
    },
    {
      value: search["revision-date-to"],
      parameterName: "revision-date-to",
      width: 25,
      formElementType: "date-picker",
    },
  );

  return (
    <GenericSearchForm
      type="content"
      selectors={selectors}
      query={queryInput}
      onSubmit={handleSearch}
      searchObject={{
        ...search,
        "draft-status": isHasPublished ? "HAS_PUBLISHED" : search["draft-status"],
      }}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
    />
  );
};

export default SearchContentForm;
