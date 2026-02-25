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
import { SearchParamsDTO } from "@ndla/types-backend/image-api";
import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchControlButtons from "../../../../components/Form/SearchControlButtons";
import SearchHeader from "../../../../components/Form/SearchHeader";
import SearchTagGroup from "../../../../components/Form/SearchTagGroup";
import { getTagName } from "../../../../components/Form/utils";
import ObjectSelector from "../../../../components/ObjectSelector";
import config from "../../../../config";
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

type SearchParams = { [k in keyof SearchParamsDTO as CamelToKebab<k>]: SearchParamsDTO[k] } & {
  width: string;
  height: string;
};

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
  { id: "custom", name: t("imageSearch.size.custom"), disabled: true },
];

export interface ImageSizeRange {
  from?: string;
  to?: string;
}

type ImageSize = "too-small" | "small" | "hd" | "4k";

const imageSizeToRangeMap: Record<ImageSize, ImageSizeRange> = {
  "too-small": { from: undefined, to: "999" },
  small: { from: "1000", to: "2000" },
  hd: { from: "2000", to: "4000" },
  "4k": { from: "4000", to: undefined },
};

const rangeToImageSizeMap: Record<string, ImageSize> = {
  "undefined-999": "too-small",
  "1000-2000": "small",
  "2000-4000": "hd",
  "4000-undefined": "4k",
};

const getSizeValue = (from: string | undefined, to: string | undefined, t: TFunction) => {
  const value = [];
  if (from) value.push(t("imageSearch.imageWidth.from", { value: from }));
  if (to) value.push(t("imageSearch.imageWidth.to", { value: to }));

  return value.join(" ");
};

const toSelectorValue = (from: string | null, to: string | null) => {
  const rangeString = `${from?.toString()}-${to?.toString()}`;
  return rangeToImageSizeMap[rangeString] ?? "custom";
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

  const removeTagItem = (parameterName: keyof SearchParams) => {
    if (parameterName === "query") setInput("");
    if (parameterName === "width") {
      setParams({ "width-from": null, "width-to": null });
    }
    if (parameterName === "height") {
      setParams({ "height-from": null, "height-to": null });
    }
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
      "width-from": null,
      "width-to": null,
      "height-from": null,
      "height-to": null,
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
    width: getSizeValue(params.get("width-from") ?? undefined, params.get("width-to") ?? undefined, t),
    height: getSizeValue(params.get("height-from") ?? undefined, params.get("height-to") ?? undefined, t),
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
          value={filters.width.length ? toSelectorValue(params.get("width-from"), params.get("width-to")) : ""}
          options={sizeOptions}
          onChange={(value) => {
            const { from, to } = imageSizeToRangeMap[value[0] as ImageSize];
            setParams({ "width-from": from, "width-to": to });
          }}
          placeholder={t("searchForm.types.image-width")}
        />
        {config.imageHeightFilterEnabled ? (
          <ObjectSelector
            name="image-height"
            value={filters.height.length ? toSelectorValue(params.get("height-from"), params.get("height-to")) : ""}
            options={sizeOptions}
            onChange={(value) => {
              const { from, to } = imageSizeToRangeMap[value[0] as ImageSize];
              setParams({ "height-from": from, "height-to": to });
            }}
            placeholder={t("searchForm.types.image-height")}
          />
        ) : undefined}

        <SearchControlButtons reset={emptySearch} />
      </StyledForm>
      <SearchTagGroup onRemoveTag={removeTagItem} tags={filters} />
    </>
  );
};

export default SearchImageForm;
