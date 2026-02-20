/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import { getTagName } from "../../../../components/Form/utils";
import ObjectSelector from "../../../../components/ObjectSelector";
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

interface Props {
  userData: UserDataDTO | undefined;
}

const getModelReleasedValues = (t: TFunction) => [
  { id: "yes", name: t("imageSearch.modelReleased.yes") },
  { id: "not-applicable", name: t("imageSearch.modelReleased.not-applicable") },
  { id: "no", name: t("imageSearch.modelReleased.no") },
  { id: "not-set", name: t("imageSearch.modelReleased.not-set") },
];

export const getInactiveOptions = (t: TFunction) => [
  { id: "true", name: t("imageSearch.inactive.true") },
  { id: "false", name: t("imageSearch.inactive.false") },
];

export const getImageSizeOptions = (t: TFunction) => [
  { id: "too-small", name: t("imageSearch.size.too-small") },
  { id: "small", name: t("imageSearch.size.small") },
  { id: "hd", name: t("imageSearch.size.hd") },
  { id: "4k", name: t("imageSearch.size.4k") },
];

export interface ImageSizeRange {
  from?: number;
  to?: number;
}

export const imageSizeToRange = (sizeId: string | undefined | null): ImageSizeRange => {
  switch (sizeId) {
    case "too-small":
      return { to: 999 };
    case "small":
      return { from: 1000, to: 2000 };
    case "hd":
      return { from: 2000, to: 4000 };
    case "4k":
      return { from: 4000 };
    default:
      return {};
  }
};

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

  const removeTagItem = (parameterName: string) => {
    if (parameterName === "query") setInput("");
    setParams({ [parameterName]: null });
  };

  const emptySearch = () => {
    setParams({
      query: null,
      language: null,
      license: null,
      "model-released": null,
      inactive: null,
      page: null,
      sort: null,
      "page-size": null,
      users: null,
      "image-width": null,
      "image-height": null,
    });
  };

  const sizeOptions = getImageSizeOptions(t);

  const filters = {
    query: queryInput,
    license: getTagName(params.get("license"), licenses),
    "model-released": getTagName(params.get("model-released"), getModelReleasedValues(t)),
    language: params.get("language"),
    inactive: getTagName(params.get("inactive"), getInactiveOptions(t)),
    // TODO: This is ugly
    users: getTagName(params.get("users")?.split(",")?.[0], users),
    "image-width": getTagName(params.get("image-width"), sizeOptions),
    "image-height": getTagName(params.get("image-height"), sizeOptions),
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
        <ObjectSelector
          name="inactive"
          value={params.get("inactive") ?? "unspecified"}
          options={getInactiveOptions(t)}
          onChange={(value) => setParams({ inactive: value[0] })}
          placeholder={t("searchForm.types.status")}
        />
        <ObjectSelector
          name="image-width"
          value={params.get("image-width") ?? ""}
          options={sizeOptions}
          onChange={(value) => setParams({ "image-width": value[0] })}
          placeholder={t("searchForm.types.image-width")}
        />
        <ObjectSelector
          name="image-height"
          value={params.get("image-height") ?? ""}
          options={sizeOptions}
          onChange={(value) => setParams({ "image-height": value[0] })}
          placeholder={t("searchForm.types.image-height")}
        />

        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchImageForm;
