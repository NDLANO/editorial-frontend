/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { CONCEPT_RESPONSIBLE, TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../../../constants";
import { OnFieldChangeFunction, SearchParams } from "../../../../interfaces";
import { useAuth0Editors, useAuth0Responsibles } from "../../../../modules/auth0/auth0Queries";
import { useConceptStateMachine } from "../../../../modules/concept/conceptQueries";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import SearchControlButtons from "../../../Form/SearchControlButtons";
import SearchHeader from "../../../Form/SearchHeader";
import SearchTagGroup, { Filters } from "../../../Form/SearchTagGroup";
import { SelectElement, SelectRenderer } from "../../../Form/SelectRenderer";
import { getTagName } from "../../../Form/utils";

const StyledForm = styled("form", {
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

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
  userData: IUserData | undefined;
}

const SearchConceptForm = ({ search, searchObject, subjects, userData }: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");
  const { data: users } = useAuth0Editors({
    select: (users) => users.map((u) => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  const { data: responsibles } = useAuth0Responsibles(
    { permission: CONCEPT_RESPONSIBLE },
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

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    if (name === "query" && evt) setQueryInput(evt.currentTarget.value);
    else search({ ...searchObject, [name]: value });
  };

  useEffect(() => {
    if (searchObject.query !== queryInput) {
      setQueryInput(searchObject.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObject.query]);

  const { data: statuses } = useConceptStateMachine();

  const getConceptStatuses = () => {
    return Object.keys(statuses || []).map((s) => {
      return { id: s, name: t(`form.status.${s.toLowerCase()}`) };
    });
  };

  const handleSearch = () => search({ ...searchObject, page: 1, query: queryInput });

  const removeTagItem = (parameterName: keyof SearchParams) => {
    if (parameterName === "query") setQueryInput("");
    search({ ...searchObject, [parameterName]: "" });
  };

  const conceptTypes = useMemo(
    () => [
      { id: "concept", name: t("searchForm.conceptType.concept") },
      { id: "gloss", name: t("searchForm.conceptType.gloss") },
    ],
    [t],
  );

  const emptySearch = () => {
    setQueryInput("");
    search({
      query: "",
      language: "",
      "audio-type": "",
      "concept-type": "",
      license: "",
      subjects: "",
      users: "",
      status: "",
      "responsible-ids": "",
    });
  };

  const sortByProperty = (property: string) => {
    type Sortable = { [key: string]: any };

    return function (a: Sortable, b: Sortable) {
      return a[property]?.localeCompare(b[property]);
    };
  };

  const sortedSubjects = useMemo(
    () =>
      subjects
        .filter((s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true")
        .sort(sortByProperty("name")),
    [subjects],
  );

  const filters: Filters = {
    query: searchObject.query,
    "concept-type": getTagName(searchObject["concept-type"], conceptTypes),
    subjects: getTagName(searchObject.subjects, sortedSubjects),
    "responsible-ids": getTagName(searchObject["responsible-ids"], responsibles),
    status: searchObject.status?.toLowerCase(),
    language: searchObject.language,
    users: getTagName(searchObject.users, users!.sort(sortByProperty("name"))),
  };

  const selectElements: SelectElement[] = [
    {
      name: "concept-type",
      options: conceptTypes,
    },
    { name: "subjects", options: sortedSubjects },
    { name: "responsible-ids", options: responsibles ?? [] },
    { name: "status", options: getConceptStatuses() },
    { name: "language", options: getResourceLanguages(t) },
    { name: "users", options: users!.sort(sortByProperty("name")) },
  ];

  return (
    <>
      <SearchHeader type="concept" userData={userData} />
      <StyledForm>
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.contentQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.contentQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
          />
        </FieldRoot>
        <SelectRenderer selectElements={selectElements} searchObject={searchObject} onFieldChange={onFieldChange} />
        <SearchControlButtons close={emptySearch} search={handleSearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchConceptForm;
