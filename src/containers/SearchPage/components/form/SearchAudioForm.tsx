/**
 * Copyright (c) 2016-present, NDLA.
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
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { getTagName } from "../../../../util/formHelper";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
  userData: IUserData | undefined;
}

const SearchAudioForm = ({
  locale,
  search,
  searchObject = {
    query: "",
    language: "",
    "audio-type": "",
  },
  userData,
}: Props) => {
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");
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
    if (searchObject.query !== queryInput) {
      setQueryInput(searchObject.query ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObject.query]);

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    if (name === "query" && evt) setQueryInput(evt.currentTarget.value);
    else search({ ...searchObject, [name]: value });
  };

  const handleSearch = () => search({ ...searchObject, page: 1, query: queryInput });

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === "query") setQueryInput("");
    search({ ...searchObject, [tag.parameterName]: "" });
  };

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput("");
    search({ query: "", language: "", "audio-type": "", license: "" });
  };

  const getAudioTypes = () => [
    { id: "standard", name: t("searchForm.audioType.standard") },
    { id: "podcast", name: t("searchForm.audioType.podcast") },
  ];

  const selectors: SearchFormSelector[] = [
    {
      parameterName: "audio-type",
      value: getTagName(searchObject["audio-type"], getAudioTypes()),
      options: getAudioTypes(),
      formElementType: "dropdown",
    },
    {
      parameterName: "license",
      value: getTagName(searchObject.license, licenses),
      options: licenses ?? [],
      formElementType: "dropdown",
    },
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
      type="audio"
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
