/**
 * Copyright (c) 2016-present, NDLA.
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
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { getTagName } from "../../../../util/formHelper";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
}

const SearchAudioForm = ({
  locale,
  search: doSearch,
  searchObject: search = {
    query: "",
    language: "",
    "audio-type": "",
  },
}: Props) => {
  const [queryInput, setQueryInput] = useState(search.query ?? "");
  const { t } = useTranslation();
  const { data: licenses } = useLicenses({
    select: (licenses) =>
      getLicensesWithTranslations(licenses, locale).map((license) => ({
        id: license.license,
        name: license.title,
      })),
    placeholderData: [],
  });

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
    doSearch({ query: "", language: "", "audio-type": "", license: "" });
  };

  const getAudioTypes = () => [
    { id: "standard", name: t("searchForm.audioType.standard") },
    { id: "podcast", name: t("searchForm.audioType.podcast") },
  ];

  const selectors: SearchFormSelector[] = [
    {
      parameterName: "audio-type",
      value: getTagName(search["audio-type"], getAudioTypes()),
      options: getAudioTypes(),
      formElementType: "dropdown",
    },
    {
      parameterName: "license",
      value: getTagName(search.license, licenses),
      options: licenses ?? [],
      formElementType: "dropdown",
    },
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
      type="audio"
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
