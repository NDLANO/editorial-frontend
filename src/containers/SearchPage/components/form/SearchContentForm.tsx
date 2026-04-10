/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldLabel, FieldRoot, FieldInput } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { DraftSearchField, DraftSearchParamsDTO } from "@ndla/types-backend/search-api";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import { partition, sortBy } from "@ndla/util";
import { TFunction } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import { getTagName } from "../../../../components/Form/utils";
import ObjectSelector, { SelectElement, SelectOption } from "../../../../components/ObjectSelector";
import {
  DA_SUBJECT_ID,
  FAVOURITES_SUBJECT_ID,
  SA_SUBJECT_ID,
  LMA_SUBJECT_ID,
  NO_SUBJECT_ID,
  NO_RESPONSIBLES,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  RESOURCE_TYPE_LEARNING_PATH,
} from "../../../../constants";
import { CamelToKebab } from "../../../../interfaces";
import { useAuth0Users } from "../../../../modules/auth0/auth0Queries";
import {
  useDraftEditors,
  useDraftStatusStateMachine,
  useLicenses,
  useDraftResponsibles,
} from "../../../../modules/draft/draftQueries";
import { useAllResourceTypes } from "../../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import formatDate from "../../../../util/formatDate";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import InlineDatePicker from "../../../FormikForm/components/InlineDatePicker";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

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

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    tabletDown: {
      gridColumn: "-1/1",
    },
  },
});

interface ContextType {
  name: string;
  id: string;
}

const getContextTypes = (resourceTypes: ResourceType[], t: TFunction) => {
  const contextTypes = resourceTypes.reduce<ContextType[]>((acc, type) => {
    if (type.id !== RESOURCE_TYPE_LEARNING_PATH) {
      acc.push({ name: type.name, id: type.id });
    }
    return acc;
  }, []);
  contextTypes.push({ name: t("contextTypes.learningpath"), id: "learningpath" });
  contextTypes.push({ name: t("contextTypes.topic"), id: "topic-article" });
  contextTypes.push({ name: t("contextTypes.frontpage"), id: "frontpage-article" });
  contextTypes.push({ name: t("contextTypes.standard"), id: "standard" });
  contextTypes.push({ name: t("contextTypes.concept"), id: "concept" });
  contextTypes.push({ name: t("contextTypes.gloss"), id: "gloss" });
  return contextTypes;
};

const getArticleTraits = (t: TFunction) => [
  { id: "VIDEO", name: t("articleTraits.VIDEO") },
  { id: "AUDIO", name: t("articleTraits.AUDIO") },
  { id: "INTERACTIVE", name: t("articleTraits.INTERACTIVE") },
  { id: "PODCAST", name: t("articleTraits.PODCAST") },
];

const userHasCustomField = (subjects: Node[], ndlaId: string | undefined, customField: string) =>
  subjects.some((s) => s.metadata.customFields?.[customField] === ndlaId);

const queryFields = [
  "title",
  "introduction",
  "content",
  "metaDescription",
  "disclaimer",
  "tags",
  "embedAttributes",
  "creators",
  "processors",
  "rightsholders",
  "revisionMeta",
  "notes",
  "previousNotes",
] satisfies DraftSearchField[];

const getQueryFieldOptions = (t: TFunction): SelectOption[] =>
  queryFields.map((field) => ({
    id: field,
    name: t(`searchForm.queryFields.${field}`),
  }));

interface Props {
  subjects: Node[];
  userData: UserDataDTO | undefined;
}

export type DraftSearchParams = { [k in keyof DraftSearchParamsDTO as CamelToKebab<k>]: DraftSearchParamsDTO[k] };

const SearchContentForm = ({ subjects, userData }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [params, setParams] = useStableSearchPageParams();
  const [queryInput, setQueryInput] = useState(params.get("query") ?? "");

  const { data: editorIds } = useDraftEditors();
  const { data: responsibleIds } = useDraftResponsibles();

  const { data: users } = useAuth0Users(
    { uniqueUserIds: editorIds?.join(",") ?? "" },
    {
      enabled: !!editorIds?.length,
      select: (users) =>
        users.map((u) => ({
          id: `${u.app_metadata.ndla_id}`,
          name: u.name,
        })),
      placeholderData: [],
    },
  );
  const { data: responsibles } = useAuth0Users(
    { uniqueUserIds: responsibleIds?.join(",") ?? "" },
    {
      enabled: !!responsibleIds?.length,
      select: (users) => {
        const options = [{ id: NO_RESPONSIBLES, name: t("searchForm.noResponsibles") }];
        return options.concat(
          users.map((u) => ({
            id: `${u.app_metadata.ndla_id}`,
            name: u.name,
          })),
        );
      },
      placeholderData: [],
    },
  );

  const { data: resourceTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: (resourceTypes) => getContextTypes(resourceTypes, t),
      placeholderData: [],
    },
  );

  const { data: licenses } = useLicenses({
    select: (licenses) =>
      getLicensesWithTranslations(licenses, i18n.language, true).map((license) => ({
        id: license.license,
        name: license.title,
      })),
    placeholderData: [],
  });

  useEffect(() => {
    setQueryInput(params.get("query") ?? "");
  }, [params]);

  const emptySearch = () => {
    setParams({
      "draft-status": null,
      "resource-types": null,
      page: null,
      "page-size": null,
      sort: null,
      "revision-date-from": null,
      "revision-date-to": null,
      "responsible-ids": null,
      query: null,
      "query-fields": null,
      language: null,
      "article-types": null,
      subjects: null,
      users: null,
      license: null,
      traits: null,
    });
  };

  const { data: statuses } = useDraftStatusStateMachine();

  const draftStatuses: SelectOption[] = useMemo(() => {
    const arr = Object.keys(statuses ?? []) ?? [];
    arr.push("HAS_PUBLISHED", "UNLISTED", "PRIVATE");
    return sortBy(
      arr.map((s) => ({ id: s, name: t(`form.status.${s.toLowerCase()}`) })),
      (s) => s.name,
    );
  }, [statuses, t]);

  const sortedSubjects: SelectOption[] = useMemo(() => {
    const [regularSubjects, conceptSubjects] = partition(
      sortBy(subjects, (s) => s.name),
      (s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true",
    );

    const finalSubjects: SelectOption[] = [{ id: FAVOURITES_SUBJECT_ID, name: t("searchForm.favourites") }];

    if (userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA)) {
      finalSubjects.push({ id: LMA_SUBJECT_ID, name: t("searchForm.LMASubjects") });
    }
    if (userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_SA)) {
      finalSubjects.push({ id: SA_SUBJECT_ID, name: t("searchForm.SASubjects") });
    }
    if (userHasCustomField(subjects, userData?.userId, TAXONOMY_CUSTOM_FIELD_SUBJECT_DA)) {
      finalSubjects.push({ id: DA_SUBJECT_ID, name: t("searchForm.DASubjects") });
    }
    finalSubjects.push({ id: NO_SUBJECT_ID, name: t("searchForm.noSubjects") });
    finalSubjects.push(...regularSubjects);

    conceptSubjects.forEach((s) => {
      finalSubjects.push({
        ...s,
        name: t("searchForm.conceptSubject", { name: s.name }),
      });
    });

    return finalSubjects;
  }, [subjects, t, userData]);

  const filters = {
    query: params.get("query"),
    "query-fields": params
      .get("query-fields")
      ?.split(",")
      .map((f) => getTagName(f, getQueryFieldOptions(t)))
      .filter((t): t is string => !!t),
    subjects: getTagName(params.get("subjects"), sortedSubjects),
    "resource-types": getTagName(params.get("resource-types"), resourceTypes),
    "responsible-ids": getTagName(params.get("responsible-ids"), responsibles),
    "draft-status": params.get("draft-status")?.toLowerCase(),
    users: getTagName(params.get("users"), users),
    language: params.get("language"),
    license: getTagName(params.get("license"), licenses),
    "revision-date-from": formatDate(params.get("revision-date-from")) || undefined,
    "revision-date-to": formatDate(params.get("revision-date-to")) || undefined,
    traits:
      params
        .get("traits")
        ?.split(",")
        .map((trait) => t(`articleTraits.${trait}`)) ?? [],
  };

  const selectElements: SelectElement<DraftSearchParams>[] = [
    { name: "query-fields", multiple: true, options: getQueryFieldOptions(t) },
    { name: "subjects", options: sortedSubjects },
    { name: "resource-types", options: sortBy(resourceTypes, (rt) => rt.name) },
    { name: "responsible-ids", options: responsibles ?? [] },
    { name: "draft-status", options: draftStatuses },
    { name: "users", options: users ?? [] },
    { name: "language", options: getResourceLanguages(t) },
    { name: "license", options: sortBy(licenses, (lic) => lic.name) },
    { name: "traits", multiple: true, options: getArticleTraits(t) },
  ];

  return (
    <>
      <SearchHeader type="content" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          setParams({ query: queryInput });
          e.preventDefault();
        }}
      >
        <StyledFieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.contentQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.contentQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
          />
        </StyledFieldRoot>
        {selectElements.map((selectElement) => (
          <FieldRoot key={selectElement.name}>
            <ObjectSelector
              name={selectElement.name}
              placeholder={t(`searchForm.types.${selectElement.name}`)}
              value={params.get(selectElement.name) ?? ""}
              multiple={selectElement.multiple}
              options={selectElement.options}
              onChange={(value) => setParams({ [selectElement.name]: value.join(",") })}
            />
          </FieldRoot>
        ))}
        <InlineDatePicker
          name="revision-date-from"
          onChange={(e) => setParams({ "revision-date-from": e.currentTarget.value })}
          placeholder={t("searchForm.types.revision-date-from")}
          value={params.get("revision-date-from") ?? ""}
        />
        <InlineDatePicker
          name="revision-date-to"
          onChange={(e) => setParams({ "revision-date-to": e.currentTarget.value })}
          placeholder={t("searchForm.types.revision-date-to")}
          value={params.get("revision-date-to") ?? ""}
        />
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup
        onRemoveTag={(name, index) => {
          const val = params.get(name)?.split(",");
          if (val && val.length > 1 && index != null) {
            setParams({ [name]: val.filter((_, idx) => idx !== index).join(",") });
          } else {
            setParams({ [name]: null });
          }
        }}
        tags={filters}
      />
    </>
  );
};

export default SearchContentForm;
