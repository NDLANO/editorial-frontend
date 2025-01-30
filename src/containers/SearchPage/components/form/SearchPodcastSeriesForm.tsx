/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserDataDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup, { Filters } from "../../../../components/Form/SearchTagGroup";
import ObjectSelector from "../../../../components/ObjectSelector";
import { OnFieldChangeFunction, SearchParams } from "../../../../interfaces";
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
  userData: IUserDataDTO | undefined;
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

  const removeTagItem = (parameterName: keyof SearchParams) => {
    if (parameterName === "query") setQueryInput("");
    doSearch({ ...searchObject, [parameterName]: "" });
  };

  const emptySearch = () => {
    setQueryInput("");
    doSearch({ query: "", language: "" });
  };

  const filters: Filters = {
    query: searchObject.query,
    language: searchObject.language,
  };

  return (
    <>
      <SearchHeader type="podcast-series" filters={filters} userData={userData} />
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
        <ObjectSelector
          name="language"
          value={searchObject.language ?? ""}
          options={getResourceLanguages(t)}
          onChange={(value) => onFieldChange("language", value)}
          placeholder={t("searchForm.types.language")}
        />
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchAudioForm;
