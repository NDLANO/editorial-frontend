/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { spacing, colors } from "@ndla/core";
import { DropdownItem, DropdownContent, DropdownMenu, DropdownTrigger } from "@ndla/dropdown-menu";
import { Plus } from "@ndla/icons/action";
import Overlay from "../Overlay";
import StyledFilledButton from "../StyledFilledButton";
import { styledListElement } from "../StyledListElement/StyledListElement";

const StyledDropdownContent = styled(DropdownContent)`
  padding: ${spacing.normal};
`;

const StyledArrow = styled(DropdownMenuArrow)`
  fill: ${colors.white};
`;

const LanguagePicker = ({ id, emptyLanguages, editUrl }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        {!!emptyLanguages.length && (
          <DropdownTrigger asChild>
            <StyledFilledButton type="button">
              <Plus /> {t("form.variant.create")}
            </StyledFilledButton>
          </DropdownTrigger>
        )}
        <StyledDropdownContent>
          <StyledArrow width={20} height={10} />
          {emptyLanguages.map((language) => (
            <DropdownItem key={language.key} asChild>
              <Link css={styledListElement} to={editUrl(id, language.key)}>
                {language.title}
              </Link>
            </DropdownItem>
          ))}
        </StyledDropdownContent>
      </DropdownMenu>
      {isOpen && <Overlay modifiers={["zIndex", "absolute"]} />}
    </div>
  );
};

interface Props {
  id: number;
  emptyLanguages: {
    key: string;
    title: string;
  }[];
  editUrl: (id: number, url: string) => string;
}

export default LanguagePicker;
