/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CloseLine } from "@ndla/icons";
import { Text, Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { visuallyHidden } from "@ndla/styled-system/patterns";
import { useId } from "react";
import { useTranslation } from "react-i18next";

const TagsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexWrap: "wrap",
  },
});

interface Props<Tags extends {}> {
  tags: Tags;
  onRemoveTag: (parameterName: keyof Tags, index: number | undefined) => void;
}

const SearchTagGroup = <Tags extends {}>({ tags, onRemoveTag }: Props<Tags>) => {
  const { t } = useTranslation();
  const activeFiltersId = useId();
  return (
    <>
      <Text id={activeFiltersId} css={visuallyHidden.raw()}>
        {t("searchPage.activeFilters")}
      </Text>
      <TagsWrapper role="group" aria-labelledby={activeFiltersId}>
        {Object.entries(tags).map(([key, value]) => {
          if (!value) return null;
          if (Array.isArray(value)) {
            return value.map((val, index) => (
              <SearchTagButton<Tags>
                key={`searchtag_${key}_${val}`}
                onRemoveTag={onRemoveTag}
                tagKey={key}
                tagValue={val}
                index={index}
              />
            ));
          } else {
            return (
              <SearchTagButton<Tags> key={`searchtag_${key}`} onRemoveTag={onRemoveTag} tagKey={key} tagValue={value} />
            );
          }
        })}
      </TagsWrapper>
    </>
  );
};

interface SearchTagButtonProps<Tags extends {}> {
  onRemoveTag: (parameterName: keyof Tags, index: number | undefined) => void;
  tagKey: string;
  tagValue: unknown;
  index?: number;
}

const SearchTagButton = <Tags extends {}>({ onRemoveTag, tagKey, tagValue, index }: SearchTagButtonProps<Tags>) => {
  const { t } = useTranslation();
  return (
    <Button
      size="small"
      variant="primary"
      onClick={() => onRemoveTag(tagKey as keyof Tags, index)}
      data-testid="remove-tag-button"
    >
      {tagKey === "query"
        ? `${t(`searchForm.tagType.${tagKey}`)} ${tagValue}`
        : t(`searchForm.tagType.${tagKey}`, { value: tagValue })}
      <CloseLine aria-label={t("remove")} title={t("remove")} />
    </Button>
  );
};

export default SearchTagGroup;
