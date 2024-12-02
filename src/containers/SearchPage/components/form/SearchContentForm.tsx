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
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import GenericSearchForm, { OnFieldChangeFunction } from "./GenericSearchForm";
import { SearchParams } from "./SearchForm";
import { SearchFormSelector } from "./Selector";
import {
  DA_SUBJECT_ID,
  DRAFT_RESPONSIBLE,
  FAVOURITES_SUBJECT_ID,
  SA_SUBJECT_ID,
  LMA_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
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

const userHasCustomField = (subjects: Node[], ndlaId: string | undefined, customField: string) =>
  subjects.some((s) => s.metadata.customFields?.[customField] === ndlaId);

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
  userData: IUserData | undefined;
}

const SearchContentForm = ({ search, searchObject, subjects, locale, userData }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");
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
    if (searchObject.query !== queryInput) {
      setQueryInput(searchObject.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObject.query]);

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
      includeOtherStatuses = searchObject["include-other-statuses"];
      status = searchObject.status;
    }
    const searchObj = {
      ...searchObject,
      "include-other-statuses": includeOtherStatuses,
      [name]: value,
    };

    if (name !== "query") {
      search(name !== "draft-status" ? searchObj : { ...searchObj, "draft-status": status, fallback: false });
    }
  };

  const handleSearch = () => {
    search({ ...searchObject, fallback: false, page: 1, query: queryInput });
  };

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    if (tag.parameterName === "draft-status") setIsHasPublished(tag.value === "HAS_PUBLISHED");
    search({ ...searchObject, [tag.parameterName]: "" });
  };

  const emptySearch = () => {
    setIsHasPublished(false);
    setQueryInput("");
    search({
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

    const userHasLMASubjects = userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA);
    const userHasSASubjects = userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_SA);
    const userHasDASubjects = userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_DA);

    const LMAsubjects: Node = generateSubjectNode(LMA_SUBJECT_ID, "searchForm.LMASubjects", t);
    const SASubjects: Node = generateSubjectNode(SA_SUBJECT_ID, "searchForm.SASubjects", t);
    const DASubjects: Node = generateSubjectNode(DA_SUBJECT_ID, "searchForm.DASubjects", t);

    const filteredAndSortedSubjects = subjects
      .filter((s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true")
      .sort(sortByProperty("name"));
    const filteredAndSortedConceptSubjects = subjects
      .filter((s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true")
      .sort(sortByProperty("name"))
      .map((s: Node) => ({ ...s, name: t("searchForm.conceptSubject", { name: s.name }) }));
    return [
      favoriteSubject,
      ...(userHasLMASubjects ? [LMAsubjects] : []),
      ...(userHasSASubjects ? [SASubjects] : []),
      ...(userHasDASubjects ? [DASubjects] : []),
    ]
      .concat(filteredAndSortedSubjects)
      .concat(filteredAndSortedConceptSubjects);
  }, [subjects, t, userData]);

  const selectors: SearchFormSelector[] = [
    {
      value: getTagName(searchObject.subjects, sortedSubjects),
      parameterName: "subjects",
      options: sortedSubjects,
      formElementType: "dropdown",
    },
    {
      value: getTagName(searchObject["resource-types"], resourceTypes),
      parameterName: "resource-types",
      options: resourceTypes!.sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(searchObject["responsible-ids"], responsibles),
      parameterName: "responsible-ids",
      options: responsibles!,
      formElementType: "dropdown",
    },
    {
      value: getTagName(isHasPublished ? "HAS_PUBLISHED" : searchObject["draft-status"], getDraftStatuses()),
      parameterName: "draft-status",
      options: getDraftStatuses().sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(searchObject.users, users),
      parameterName: "users",
      options: users!.sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(searchObject.language, getResourceLanguages(t)),
      parameterName: "language",
      options: getResourceLanguages(t),
      formElementType: "dropdown",
    },
    {
      value: searchObject["filter-inactive"]?.toString(),
      parameterName: "filter-inactive",
      formElementType: "check-box-reverse",
    },
    {
      value: searchObject["exclude-revision-log"]?.toString(),
      parameterName: "exclude-revision-log",
      formElementType: "check-box",
    },
  ];

  selectors.push(
    {
      value: searchObject["revision-date-from"],
      parameterName: "revision-date-from",
      formElementType: "date-picker",
    },
    {
      value: searchObject["revision-date-to"],
      parameterName: "revision-date-to",
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
        ...searchObject,
        "draft-status": isHasPublished ? "HAS_PUBLISHED" : searchObject["draft-status"],
      }}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
      userData={userData}
      columnCount={4}
    />
  );
};

export default SearchContentForm;
