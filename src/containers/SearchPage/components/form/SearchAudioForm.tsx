/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldRoot, FieldInput, FieldLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SearchParamsDTO } from "@ndla/types-backend/audio-api";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import { getTagName } from "../../../../components/Form/utils";
import ObjectSelector, { SelectElement } from "../../../../components/ObjectSelector";
import { CamelToKebab } from "../../../../interfaces";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

type SearchParams = { [k in keyof SearchParamsDTO as CamelToKebab<k>]: SearchParamsDTO[k] };

const StyledForm = styled("form", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
  },
});

interface Props {
  userData: UserDataDTO | undefined;
}

const SearchAudioForm = ({ userData }: Props) => {
  const [params, setParams] = useStableSearchPageParams();
  const queryParam = useMemo(() => params.get("query") || "", [params]);
  const [input, setInput] = useState(queryParam);
  const { t, i18n } = useTranslation();
  const { data: licenses } = useLicenses({
    select: (licenses) =>
      getLicensesWithTranslations(licenses, i18n.language).map((license) => ({
        id: license.license,
        name: license.title,
      })),
    placeholderData: [],
  });

  useEffect(() => {
    setInput(queryParam);
  }, [queryParam]);

  const removeTagItem = (parameterName: keyof SearchParams) => {
    setParams({ [parameterName]: null });
  };

  const emptySearch = () => {
    setParams({
      "audio-type": null,
      page: null,
      "page-size": null,
      query: null,
      language: null,
      sort: null,
      license: null,
    });
  };

  const getAudioTypes = () => [
    { id: "standard", name: t("searchForm.audioType.standard") },
    { id: "podcast", name: t("searchForm.audioType.podcast") },
  ];

  const filters = {
    query: queryParam,
    "audio-type": getTagName(params.get("audio-type"), getAudioTypes()),
    license: getTagName(params.get("license"), licenses),
    language: params.get("language"),
  };

  const selectElements: SelectElement<SearchParams>[] = [
    { name: "audio-type", options: getAudioTypes() },
    { name: "license", options: licenses ?? [] },
    { name: "language", options: getResourceLanguages(t) },
  ];

  return (
    <>
      <SearchHeader type="audio" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          setParams({ query: input });
        }}
      >
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.audioQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.audioQuery")}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
        </FieldRoot>
        {selectElements.map((selectElement) => (
          <FieldRoot key={selectElement.name}>
            <ObjectSelector
              name={selectElement.name}
              placeholder={t(`searchForm.types.${selectElement.name}`)}
              value={params.get(selectElement.name) ?? ""}
              options={selectElement.options}
              onChange={(value) => setParams({ [selectElement.name]: value.join(",") })}
            />
          </FieldRoot>
        ))}
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchAudioForm;
