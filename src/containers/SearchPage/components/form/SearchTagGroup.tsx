/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SearchParams } from "./types";

const TagsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexWrap: "wrap",
  },
});

export type Filters = { [key in keyof SearchParams]: string | undefined };
interface Props {
  tags: Filters;
  onRemoveTag: (parameterName: keyof SearchParams, value?: string) => void;
}

const SearchTagGroup = ({ tags, onRemoveTag }: Props) => {
  const { t } = useTranslation();
  return (
    <TagsWrapper role="group">
      {Object.entries(tags).map(([key, value]) => {
        if (!value) return null;
        return (
          <Button
            key={`searchtag_${key}`}
            size="small"
            variant="primary"
            onClick={() => onRemoveTag(key as keyof SearchParams, value)}
            data-testid="remove-tag-button"
          >
            {t(`searchForm.tagType.${key}`, { value })}
            <CloseLine aria-label={t("remove")} title={t("remove")} />
          </Button>
        );
      })}
    </TagsWrapper>
  );
};

export default SearchTagGroup;
