/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import { useEffect, useState, MouseEvent, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { CONCEPT_RESPONSIBLE, TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../../../constants";
import GenericSearchForm, {
  OnFieldChangeFunction,
} from "../../../../containers/SearchPage/components/form/GenericSearchForm";
import { SearchParams } from "../../../../containers/SearchPage/components/form/SearchForm";
import { SearchFormSelector } from "../../../../containers/SearchPage/components/form/Selector";
import { useAuth0Editors, useAuth0Responsibles } from "../../../../modules/auth0/auth0Queries";
import { useConceptStateMachine } from "../../../../modules/concept/conceptQueries";
import { getTagName } from "../../../../util/formHelper";
import { getResourceLanguages } from "../../../../util/resourceHelpers";

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

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    search({ ...searchObject, [tag.parameterName]: "" });
  };

  const conceptTypes = useMemo(
    () => [
      { id: "concept", name: t("searchForm.conceptType.concept") },
      { id: "gloss", name: t("searchForm.conceptType.gloss") },
    ],
    [t],
  );

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
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

  const selectors: SearchFormSelector[] = [
    {
      parameterName: "concept-type",
      value: getTagName(searchObject["concept-type"], conceptTypes),
      options: conceptTypes,
      formElementType: "dropdown",
    },
    {
      parameterName: "subjects",
      value: getTagName(searchObject.subjects, subjects),
      options: subjects
        .filter((s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true")
        .sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
    {
      value: getTagName(searchObject["responsible-ids"], responsibles),
      parameterName: "responsible-ids",
      options: responsibles!,
      formElementType: "dropdown",
    },
    {
      parameterName: "status",
      value: getTagName(searchObject.status, getConceptStatuses()),
      options: getConceptStatuses(),
      formElementType: "dropdown",
    },
    {
      parameterName: "language",
      value: getTagName(searchObject.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      formElementType: "dropdown",
    },
    {
      parameterName: "users",
      value: getTagName(searchObject.users, users),
      options: users!.sort(sortByProperty("name")),
      formElementType: "dropdown",
    },
  ];

  return (
    <GenericSearchForm
      type="concept"
      selectors={selectors}
      query={queryInput}
      onSubmit={handleSearch}
      searchObject={searchObject}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
      userData={userData}
      disableSavedSearch
    />
  );
};

export default SearchConceptForm;
