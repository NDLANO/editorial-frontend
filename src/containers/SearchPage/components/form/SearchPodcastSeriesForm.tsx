/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import GenericSearchForm, { OnFieldChangeFunction } from "./GenericSearchForm";
import { SearchParams } from "./SearchForm";
import { SearchFormSelector } from "./Selector";
import { getTagName } from "../../../../util/formHelper";
import { getResourceLanguages } from "../../../../util/resourceHelpers";

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
  userData: IUserData | undefined;
}

const SearchAudioForm = ({
  search: doSearch,
  searchObject = {
    query: "",
    language: "",
    "audio-type": "",
  },
  userData,
}: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");

  useEffect(() => {
    if (searchObject.query !== queryInput) {
      setQueryInput(searchObject.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObject.query]);

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    if (name === "query" && evt) setQueryInput(evt.currentTarget.value);
    else doSearch({ ...searchObject, [name]: value });
  };

  const handleSearch = () => doSearch({ ...searchObject, page: 1, query: queryInput });

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    doSearch({ ...searchObject, [tag.parameterName]: "" });
  };

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput("");
    doSearch({ query: "", language: "" });
  };

  const selectors: SearchFormSelector[] = [
    {
      parameterName: "language",
      value: getTagName(searchObject.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
      formElementType: "dropdown",
    },
  ];

  return (
    <GenericSearchForm
      type="podcast-series"
      selectors={selectors}
      query={queryInput}
      onSubmit={handleSearch}
      searchObject={searchObject}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
      userData={userData}
    />
  );
};

export default SearchAudioForm;
