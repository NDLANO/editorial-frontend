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
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { SearchParamsDTO } from "@ndla/types-backend/image-api";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import { getTagName } from "../../../../components/Form/utils";
import ObjectSelector from "../../../../components/ObjectSelector";
import { CamelToKebab } from "../../../../interfaces";
import { useAuth0Editors } from "../../../../modules/auth0/auth0Queries";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { getLicensesWithTranslations } from "../../../../util/licenseHelpers";
import { getResourceLanguages } from "../../../../util/resourceHelpers";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

const StyledForm = styled("form", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
  },
});

type SearchParams = { [k in keyof SearchParamsDTO as CamelToKebab<k>]: SearchParamsDTO[k] };

interface Props {
  userData: UserDataDTO | undefined;
}

const getModelReleasedValues = (t: TFunction) => [
  { id: "yes", name: t("imageSearch.modelReleased.yes") },
  { id: "not-applicable", name: t("imageSearch.modelReleased.not-applicable") },
  { id: "no", name: t("imageSearch.modelReleased.no") },
  { id: "not-set", name: t("imageSearch.modelReleased.not-set") },
];

const SearchImageForm = ({ userData }: Props) => {
  const [params, setParams] = useStableSearchPageParams();
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState(params.get("query") ?? "");
  const queryInput = params.get("query");
  const { data: licenses } = useLicenses({
    select: (licenses) =>
      getLicensesWithTranslations(licenses, i18n.language).map((license) => ({
        id: license.license,
        name: license.title,
      })),
    placeholderData: [],
  });

  const { data: users } = useAuth0Editors({
    select: (users) => users.map((u) => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  useEffect(() => {
    setInput(queryInput ?? "");
  }, [queryInput]);

  const removeTagItem = (parameterName: keyof SearchParams) => {
    if (parameterName === "query") setInput("");
    setParams({ [parameterName]: null });
  };

  const emptySearch = () => {
    setParams({
      query: null,
      language: null,
      license: null,
      "model-released": null,
      page: null,
      sort: null,
      "page-size": null,
      users: null,
    });
  };

  const filters = {
    query: queryInput,
    license: getTagName(params.get("license"), licenses),
    "model-released": getTagName(params.get("model-released"), getModelReleasedValues(t)),
    language: params.get("language"),
    // TODO: This is ugly
    users: getTagName(params.get("users")?.split(",")?.[0], users),
  };

  return (
    <>
      <SearchHeader type="image" filters={filters} userData={userData} />
      <StyledForm
        onSubmit={(e) => {
          setParams({ query: input });
          e.preventDefault();
        }}
      >
        <FieldRoot>
          <FieldLabel srOnly>{t("searchForm.types.imageQuery")}</FieldLabel>
          <FieldInput
            name="query"
            placeholder={t("searchForm.types.imageQuery")}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
        </FieldRoot>
        <ObjectSelector
          name="license"
          value={params.get("license") ?? ""}
          options={licenses ?? []}
          onChange={(value) => setParams({ license: value[0] })}
          placeholder={t("searchForm.types.license")}
        />
        <ObjectSelector
          name="model-released"
          value={params.get("model-released") ?? ""}
          options={getModelReleasedValues(t)}
          onChange={(value) => setParams({ "model-released": value[0] })}
          placeholder={t("searchForm.types.model-released")}
        />
        <ObjectSelector
          name="language"
          value={params.get("language") ?? ""}
          options={getResourceLanguages(t)}
          onChange={(value) => setParams({ language: value[0] })}
          placeholder={t("searchForm.types.language")}
        />
        <ObjectSelector
          name="users"
          value={params.get("users") ?? ""}
          options={users ?? []}
          onChange={(value) => setParams({ users: value[0] })}
          placeholder={t("searchForm.types.users")}
        />
        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchImageForm;
