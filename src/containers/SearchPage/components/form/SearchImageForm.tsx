/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import SearchControlButtons from "./SearchControlButtons";
import SearchHeader from "./SearchHeader";
import SearchTagGroup, { Filters } from "./SearchTagGroup";
import { OnFieldChangeFunction, SearchParams } from "./types";
import { getTagName } from "./utils";
import ObjectSelector from "../../../../components/ObjectSelector";
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

const getModelReleasedValues = (t: TFunction) => [
  { id: "yes", name: t("imageSearch.modelReleased.yes") },
  { id: "not-applicable", name: t("imageSearch.modelReleased.not-applicable") },
  { id: "no", name: t("imageSearch.modelReleased.no") },
  { id: "not-set", name: t("imageSearch.modelReleased.not-set") },
];

const SearchImageForm = ({
  locale,
  search,
  searchObject = {
    query: "",
    language: "",
  },
  userData,
}: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(searchObject.query ?? "");
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
    search({ query: "", language: "", license: "", "model-released": "" });
  };

  const filters: Filters = {
    query: searchObject.query,
    license: getTagName(searchObject["license"], licenses),
    "model-released": getTagName(searchObject["model-released"], getModelReleasedValues(t)),
    language: searchObject.language,
  };

  return (
    <>
      <SearchHeader type="image" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          handleSearch();
          e.preventDefault();
        }}
      >
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.imageQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.imageQuery")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.currentTarget.value)}
          />
        </FieldRoot>
        <ObjectSelector
          name="license"
          value={searchObject.license ?? ""}
          options={licenses ?? []}
          onChange={(value) => onFieldChange("license", value)}
          placeholder={t("searchForm.types.license")}
        />
        <ObjectSelector
          name="model-released"
          value={searchObject["model-released"] ?? ""}
          options={getModelReleasedValues(t)}
          onChange={(value) => onFieldChange("model-released", value)}
          placeholder={t("searchForm.types.model-released")}
        />
        <ObjectSelector
          name="language"
          value={searchObject.language ?? ""}
          options={getResourceLanguages(t)}
          onChange={(value) => onFieldChange("language", value)}
          placeholder={t("searchForm.types.language")}
        />
        <SearchControlButtons close={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchImageForm;
