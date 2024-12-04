/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledButton = styled(Button, {
  base: {
    minWidth: "surface.4xsmall",
  },
});

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    gridColumn: "-1/1",
  },
});

interface Props {
  close: () => void;
  search?: () => void;
}

const SearchControlButtons = ({ close, search }: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonContainer>
      <StyledButton onClick={close} variant="secondary" size="small">
        {t("searchForm.empty")}
      </StyledButton>
      {search ? (
        <StyledButton onClick={search} size="small">
          {t("searchForm.btn")}
        </StyledButton>
      ) : (
        <StyledButton type="submit" size="small">
          {t("searchForm.btn")}
        </StyledButton>
      )}
    </ButtonContainer>
  );
};

export default SearchControlButtons;
