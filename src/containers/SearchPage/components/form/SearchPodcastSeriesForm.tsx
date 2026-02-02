/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import ObjectSelector from "../../../../components/ObjectSelector";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

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
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();
  const [input, setInput] = useState(params.get("query") ?? "");
  const queryInput = params.get("query");

  useEffect(() => {
    setInput(queryInput ?? "");
  }, [queryInput]);

  const emptySearch = () => {
    setParams({
      page: null,
      "page-size": null,
      sort: null,
      query: null,
      language: null,
    });
  };

  const filters = {
    query: params.get("query"),
    language: params.get("language"),
  };

  return (
    <>
      <SearchHeader type="podcast-series" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          setParams({ query: input });
          e.preventDefault();
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
        <ObjectSelector
          name="language"
          value={params.get("language") ?? ""}
          options={getResourceLanguages(t)}
          onChange={(value) => setParams({ language: value[0] })}
          placeholder={t("searchForm.types.language")}
        />
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={(tag) => setParams({ [tag]: null })} tags={filters} />
    </>
  );
};

export default SearchAudioForm;
