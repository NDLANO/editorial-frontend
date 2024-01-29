/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, fonts, spacing } from "@ndla/core";
import { TrashCanOutline } from "@ndla/icons/action";
import { Search } from "@ndla/icons/common";
import Tooltip from "@ndla/tooltip";
import { NoShadowLink } from "../../WelcomePage/components/NoShadowLink";

const StyledItem = styled.li`
  ${fonts.sizes("16px")};
  color: ${colors.brand.primary};
  padding: ${spacing.xsmall} ${spacing.xsmall};
  margin: 0;
  display: flex;
  align-items: center;
`;

const StyledNoShadowLink = styled(NoShadowLink)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const StyledSearch = styled(Search)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;
const StyledTrashCanOutline = styled(TrashCanOutline)`
  width: 24px;
  height: 24px;
`;
interface Props {
  searchText: string;
  deleteSearch: (item: number) => void;
  index: number;
  url: string;
}
const SavedSearchItem = ({ searchText = "", deleteSearch, index, url, ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledItem {...rest}>
      <StyledNoShadowLink to={url}>
        <StyledSearch />
        {searchText}
      </StyledNoShadowLink>
      <Tooltip tooltip={t("welcomePage.deleteSavedSearch")}>
        <IconButtonV2
          aria-label={t("welcomePage.deleteSavedSearch")}
          variant="ghost"
          onClick={(e) => {
            deleteSearch(index);
            e.stopPropagation();
          }}
          size="xsmall"
          colorTheme="danger"
        >
          <StyledTrashCanOutline />
        </IconButtonV2>
      </Tooltip>
    </StyledItem>
  );
};

export default SavedSearchItem;
