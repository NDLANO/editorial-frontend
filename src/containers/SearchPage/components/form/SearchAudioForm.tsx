/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldRoot, FieldInput, FieldLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup, { Filters } from "../../../../components/Form/SearchTagGroup";
import { SelectElement, SelectRenderer } from "../../../../components/Form/SelectRenderer";
import { getTagName } from "../../../../components/Form/utils";
import { OnFieldChangeFunction, SearchParams } from "../../../../interfaces";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";

const StyledForm = styled("form", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
  },
});

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

  const removeTagItem = (parameterName: keyof SearchParams) => {
    if (parameterName === "query") setQueryInput("");
    search({ ...searchObject, [parameterName]: "" });
  };

  const emptySearch = () => {
    setQueryInput("");
    search({ query: "", language: "", "audio-type": "", license: "" });
  };

  const getAudioTypes = () => [
    { id: "standard", name: t("searchForm.audioType.standard") },
    { id: "podcast", name: t("searchForm.audioType.podcast") },
  ];

  const filters: Filters = {
    query: searchObject.query,
    "audio-type": getTagName(searchObject["audio-type"], getAudioTypes()),
    license: getTagName(searchObject.license, licenses),
    language: searchObject.language,
  };

  const selectElements: SelectElement[] = [
    { name: "audio-type", options: getAudioTypes() },
    { name: "license", options: licenses ?? [] },
    { name: "language", options: getResourceLanguages(t) },
  ];

  return (
    <>
      <SearchHeader type="audio" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          handleSearch();
          e.preventDefault();
        }}
      >
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.audioQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.audioQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
          />
        </FieldRoot>
        <SelectRenderer selectElements={selectElements} searchObject={searchObject} onFieldChange={onFieldChange} />
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchAudioForm;
