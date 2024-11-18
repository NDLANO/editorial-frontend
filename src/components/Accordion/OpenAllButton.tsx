/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Children, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ChildType } from "./FormAccordionsWithComments";

interface Props {
  openAccordions: string[];
  setOpenAccordions: (values: string[]) => void;
  formAccordionChildren: ChildType | ChildType[];
}

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-end",
  },
});

const OpenAllButton = ({ openAccordions, setOpenAccordions, formAccordionChildren }: Props) => {
  const { t } = useTranslation();

  const accordionChildren = useMemo(
    () => Children.map(formAccordionChildren, (c) => (c ? c.props?.id : false))?.filter(Boolean) ?? [],
    [formAccordionChildren],
  );

  const allOpen = useMemo(
    () => accordionChildren.length === openAccordions.length,
    [accordionChildren.length, openAccordions.length],
  );

  const onChangeAll = useCallback(() => {
    if (allOpen) {
      setOpenAccordions([]);
    } else {
      setOpenAccordions(accordionChildren);
    }
  }, [allOpen, setOpenAccordions, accordionChildren]);

  return (
    <StyledButton onClick={onChangeAll} variant="tertiary" size="small">
      {allOpen ? t("accordion.closeAll") : t("accordion.openAll")}
    </StyledButton>
  );
};

export default OpenAllButton;
