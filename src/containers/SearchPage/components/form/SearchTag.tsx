/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { CloseLine } from "@ndla/icons/action";
import { IconButton } from "@ndla/primitives";
import { SearchFormSelector } from "./Selector";
import formatDate from "../../../../util/formatDate";
import { unreachable } from "../../../../util/guards";

const StyledDl = styled.dl`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  border-radius: 1px;
  background-color: ${colors.background.dark};
  color: #5c5c5c;
  line-height: 1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  margin: 0.1rem 0.3rem;
  margin-right: ${spacing.small};
  &:first-of-type {
    margin-left: 0;
  }
`;

const StyledDt = styled.dt`
  font-weight: 800;
  font-size: 0.8em;
  color: ${colors.black};
`;

const StyledDd = styled.dd`
  margin-left: 0.3rem;
  margin-right: 0.3rem;
`;

interface Props {
  tag: SearchFormSelector;
  onRemoveItem: (tag: SearchFormSelector) => void;
}

const SearchTagContent = ({
  tag,
  tagValue,
}: {
  tag: SearchFormSelector;
  tagValue: string | number | boolean | undefined;
}) => {
  const { t } = useTranslation();
  const isCheckboxTag = tag.formElementType === "check-box" || tag.formElementType === "check-box-reverse";

  return (
    <>
      {!isCheckboxTag && <StyledDt>{t(`searchForm.tagType.${tag.parameterName}`)}:</StyledDt>}
      <StyledDd>{tagValue}</StyledDd>
    </>
  );
};

const SearchTag = ({ tag, onRemoveItem }: Props) => {
  const { t } = useTranslation();

  const onRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveItem(tag);
  };

  const searchParamsFormatter = (selector: SearchFormSelector): string | number | boolean | undefined => {
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

  const tagValue = searchParamsFormatter(tag);

  if (tagValue === undefined) return null;

  return (
    <StyledDl>
      <SearchTagContent tag={tag} tagValue={tagValue} />
      <IconButton
        aria-label={t("remove")}
        variant="clear"
        title={t("remove")}
        onClick={onRemove}
        size="small"
        data-testid="remove-tag-button"
      >
        <CloseLine />
      </IconButton>
    </StyledDl>
  );
};

export default SearchTag;
