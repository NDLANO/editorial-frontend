/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { Filters } from "./SearchTagGroup";
import { SearchType } from "../../../../interfaces";
import SearchSaveButton from "../../SearchSaveButton";

const StyledSearchHeader = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

interface Props {
  type: SearchType;
  filters?: Filters;
  userData: IUserData | undefined;
}

const SearchHeader = ({ type, filters, userData }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledSearchHeader>
      <Heading textStyle="title.large">{t(`searchPage.header.${type}`)}</Heading>
      {!!filters && <SearchSaveButton userData={userData} filters={filters} searchContentType={type} />}
    </StyledSearchHeader>
  );
};

export default SearchHeader;
