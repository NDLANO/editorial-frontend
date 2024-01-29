/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
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
}

const SearchAudioForm = ({
  search: doSearch,
  searchObject: search = {
    query: "",
    language: "",
    "audio-type": "",
  },
}: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? "");

  useEffect(() => {
    if (search.query !== queryInput) {
      setQueryInput(search.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.query]);

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    if (name === "query" && evt) setQueryInput(evt.currentTarget.value);
    else doSearch({ ...search, [name]: value });
  };

  const handleSearch = () => doSearch({ ...search, page: 1, query: queryInput });

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    doSearch({ ...search, [tag.parameterName]: "" });
  };

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput("");
    doSearch({ query: "", language: "" });
  };

  const selectors: SearchFormSelector[] = [
    {
      parameterName: "language",
      value: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
      formElementType: "dropdown",
    },
  ];

  return (
    <GenericSearchForm
      type="podcastSeries"
      selectors={selectors}
      query={queryInput}
      onSubmit={handleSearch}
      searchObject={search}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
    />
  );
};

export default SearchAudioForm;
