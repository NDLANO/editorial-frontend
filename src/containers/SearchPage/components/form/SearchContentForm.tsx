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
import { FieldLabel, FieldRoot, FieldInput } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import CheckboxSelector from "./CheckboxSelector";
import SearchControlButtons from "./SearchControlButtons";
import { SearchParams } from "./SearchForm";
import SearchHeader from "./SearchHeader";
import SearchTagGroup, { Filters } from "./SearchTagGroup";
import { SelectElement, SelectRenderer } from "./SelectRenderer";
import { OnFieldChangeFunction } from "./types";
import { getTagName } from "./utils";
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
import formatDate from "../../../../util/formatDate";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import { flattenResourceTypesAndAddContextTypes } from "../../../../util/taxonomyHelpers";
import InlineDatePicker from "../../../FormikForm/components/InlineDatePicker";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const StyledForm = styled("form", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
    desktopDown: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    tabletDown: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

const StyledFieldInput = styled(FieldInput, {
  base: {
    tabletDown: {
      gridColumn: "-1/1",
    },
  },
});

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

  const removeTagItem = (parameterName: keyof SearchParams, value?: string) => {
    if (parameterName === "query") setQueryInput("");
    if (parameterName === "draft-status") setIsHasPublished(value === "HAS_PUBLISHED");
    search({ ...searchObject, [parameterName]: "" });
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

  const filters: Filters = {
    query: searchObject.query,
    subjects: getTagName(searchObject.subjects, sortedSubjects),
    "resource-types": getTagName(searchObject["resource-types"], resourceTypes),
    "responsible-ids": getTagName(searchObject["responsible-ids"], responsibles),
    "draft-status": (isHasPublished ? "HAS_PUBLISHED" : searchObject["draft-status"])?.toLowerCase(),
    users: getTagName(searchObject.users, users),
    language: searchObject.language,
    "filter-inactive": !searchObject["filter-inactive"] ? "false" : undefined,
    "exclude-revision-log": searchObject["exclude-revision-log"] ? "true" : undefined,
    "revision-date-from": formatDate(searchObject["revision-date-from"]) || undefined,
    "revision-date-to": formatDate(searchObject["revision-date-to"]) || undefined,
  };

  const selectElements: SelectElement[] = [
    { name: "subjects", options: sortedSubjects },
    { name: "resource-types", options: resourceTypes!.sort(sortByProperty("name")) ?? [] },
    { name: "responsible-ids", options: responsibles ?? [] },
    { name: "draft-status", options: getDraftStatuses().sort(sortByProperty("name")) },
    { name: "users", options: users!.sort(sortByProperty("name")) },
    { name: "language", options: getResourceLanguages(t) },
  ];

  return (
    <>
      <SearchHeader type="content" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          handleSearch();
          e.preventDefault();
        }}
      >
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.contentQuery")}</FieldLabel>
          <StyledFieldInput
            name="query"
            placeholder={t("searchForm.types.contentQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
          />
        </FieldRoot>
        <SelectRenderer selectElements={selectElements} searchObject={searchObject} onFieldChange={onFieldChange} />
        <CheckboxSelector
          name="filter-inactive"
          checked={!(searchObject["filter-inactive"] ?? false)}
          onCheckedChange={(value) => onFieldChange("filter-inactive", !value)}
        />
        <CheckboxSelector
          name="exclude-revision-log"
          checked={searchObject["exclude-revision-log"] ?? false}
          onCheckedChange={(value) => onFieldChange("exclude-revision-log", value)}
        />
        <InlineDatePicker
          name="revision-date-from"
          onChange={(e) => onFieldChange("revision-date-from", e.currentTarget.value, e)}
          placeholder={t("searchForm.types.revision-date-from")}
          value={searchObject["revision-date-from"] ?? ""}
        />
        <InlineDatePicker
          name="revision-date-to"
          onChange={(e) => onFieldChange("revision-date-to", e.currentTarget.value, e)}
          placeholder={t("searchForm.types.revision-date-to")}
          value={searchObject["revision-date-to"] ?? ""}
        />
        <SearchControlButtons close={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchContentForm;
