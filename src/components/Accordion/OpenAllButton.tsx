/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Children, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { ChildType } from "./FormAccordionsWithComments";

interface Props {
  openAccordions: string[];
  setOpenAccordions: (v: string[]) => void;
  childs: ChildType | ChildType[];
}

const StyledButton = styled(ButtonV2)`
  align-self: flex-end;
`;

const OpenAllButton = ({ openAccordions, setOpenAccordions, childs }: Props) => {
  const { t } = useTranslation();

  const accordionChildren = useMemo(
    () => Children.map(childs, (c) => (!c ? false : c?.props?.id))?.filter(Boolean) ?? [],
    [childs],
  );

  const allOpen = useMemo(
    () => accordionChildren.length === openAccordions.length,
    [accordionChildren, openAccordions.length],
  );

  const onChangeAll = useCallback(() => {
    if (allOpen) {
      setOpenAccordions([]);
    } else {
      setOpenAccordions(accordionChildren);
    }
  }, [allOpen, setOpenAccordions, accordionChildren]);

  return (
    <StyledButton onClick={onChangeAll} variant="ghost">
      {allOpen ? t("accordion.closeAll") : t("accordion.openAll")}
    </StyledButton>
  );
};

export default OpenAllButton;
