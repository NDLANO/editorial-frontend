/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DraftConceptSearchParamsDTO } from "@ndla/types-backend/concept-api";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { sortBy } from "@ndla/util";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CONCEPT_RESPONSIBLE } from "../../../../constants";
import { CamelToKebab } from "../../../../interfaces";
import { useAuth0Editors, useAuth0Responsibles } from "../../../../modules/auth0/auth0Queries";
import { useConceptStateMachine } from "../../../../modules/concept/conceptQueries";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import SearchControlButtons from "../../../Form/SearchControlButtons";
import SearchHeader from "../../../Form/SearchHeader";
import SearchTagGroup from "../../../Form/SearchTagGroup";
import { getTagName } from "../../../Form/utils";
import ObjectSelector, { SelectElement } from "../../../ObjectSelector";

const SearchFieldsWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
    tabletDown: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

export type ConceptSearchParams = {
  [k in keyof DraftConceptSearchParamsDTO as CamelToKebab<k>]: DraftConceptSearchParamsDTO[k];
};

export type UpdateSearchParamFn = <Param extends keyof ConceptSearchParams>(
  param: Param,
  value: ConceptSearchParams[Param] | null,
) => void;

interface Props {
  onUpdateSearchParam: UpdateSearchParamFn;
  searchObject: ConceptSearchParams;
  onClearSearch: () => void;
  locale: string;
  userData: UserDataDTO | undefined;
}

const SearchConceptFormContent = ({ onUpdateSearchParam, searchObject, userData, onClearSearch }: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");
  const usersQuery = useAuth0Editors();

  useEffect(() => {
    setQueryInput(searchObject.query ?? "");
  }, [searchObject.query]);

  const users = useMemo(() => {
    const mapped = usersQuery.data?.map((u) => ({ id: u.app_metadata.ndla_id, name: u.name })) ?? [];
    return sortBy(mapped, (u) => u.name);
  }, [usersQuery.data]);

  const responsiblesQuery = useAuth0Responsibles({ permission: CONCEPT_RESPONSIBLE });

  const responsibles = useMemo(() => {
    const mapped = responsiblesQuery.data?.map((u) => ({ id: u.app_metadata.ndla_id, name: u.name })) ?? [];
    return sortBy(mapped, (u) => u.name);
  }, [responsiblesQuery.data]);

  const statusQuery = useConceptStateMachine();

  const conceptStatuses = useMemo(() => {
    return Object.keys(statusQuery.data ?? []).map((s) => ({ id: s, name: t(`form.status.${s.toLowerCase()}`) }));
  }, [statusQuery.data, t]);

  const handleSearch = () => onUpdateSearchParam("query", queryInput);

  const removeTagItem = (parameterName: keyof ConceptSearchParams) => {
    onUpdateSearchParam(parameterName, null);
  };

  const conceptTypes = useMemo(
    () => [
      { id: "concept", name: t("searchForm.conceptType.concept") },
      { id: "gloss", name: t("searchForm.conceptType.gloss") },
    ],
    [t],
  );

  const filters: Partial<Record<keyof ConceptSearchParams, string | undefined>> = {
    query: searchObject.query,
    "concept-type": getTagName(searchObject["concept-type"], conceptTypes),
    "responsible-ids": getTagName(searchObject["responsible-ids"]?.[0], responsibles),
    status: searchObject.status?.[0]?.toLowerCase(),
    language: searchObject.language,
    users: getTagName(searchObject.users?.[0], users),
  };

  const selectElements: SelectElement<ConceptSearchParams>[] = [
    { name: "concept-type", options: conceptTypes },
    { name: "responsible-ids", options: responsibles },
    { name: "status", options: conceptStatuses },
    { name: "language", options: getResourceLanguages(t) },
    { name: "users", options: users },
  ];

  return (
    <>
      <SearchHeader type="concept" userData={userData} />
      <SearchFieldsWrapper>
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.contentQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.contentQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </FieldRoot>
        {selectElements.map((selectElement) => (
          <FieldRoot key={selectElement.name}>
            <ObjectSelector
              name={selectElement.name}
              placeholder={t(`searchForm.types.${selectElement.name}`)}
              value={(searchObject[selectElement.name] as string) ?? ""}
              options={selectElement.options}
              onChange={(val) => onUpdateSearchParam(selectElement.name, val.join(","))}
            />
          </FieldRoot>
        ))}
        <SearchControlButtons reset={onClearSearch} search={handleSearch} />
      </SearchFieldsWrapper>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchConceptFormContent;
