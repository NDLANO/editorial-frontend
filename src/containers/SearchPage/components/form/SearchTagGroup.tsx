/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SearchFormSelector } from "./Selector";
import formatDate from "../../../../util/formatDate";
import { unreachable } from "../../../../util/guards";

const TagsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexWrap: "wrap",
  },
});

const searchParamsFormatter = (selector: SearchFormSelector, t: TFunction): string | number | boolean | undefined => {
  switch (selector.formElementType) {
    case "date-picker":
      if (selector.value) return formatDate(selector.value);
      break;
    case "check-box":
      if (selector.value === "true") return t(`searchForm.tagType.${selector.parameterName}`);
      break;
    case "check-box-reverse":
      if (selector.value === "false") return t(`searchForm.tagType.${selector.parameterName}`);
      break;
    case "dropdown":
    case "text-input":
      return selector.value;
    default:
      unreachable(selector);
  }
};

interface Props {
  tagTypes: SearchFormSelector[];
  onRemoveTag: (tag: SearchFormSelector) => void;
}

const SearchTagGroup = ({ tagTypes, onRemoveTag }: Props) => {
  const { t } = useTranslation();
  return (
    <TagsWrapper>
      {tagTypes.map((tag) => {
        const value = searchParamsFormatter(tag, t);
        if (!value) return null;
        return (
          <Button
            key={`searchtag_${tag.parameterName}`}
            size="small"
            variant="primary"
            onClick={() => onRemoveTag(tag)}
            data-testid="remove-tag-button"
          >
            {value}
            <CloseLine aria-label={t("remove")} title={t("remove")} />
          </Button>
        );
      })}
    </TagsWrapper>
  );
};

export default SearchTagGroup;
