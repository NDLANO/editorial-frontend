/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { DropdownItem, DropdownContent, DropdownMenu, DropdownTrigger } from "@ndla/dropdown-menu";
import { Plus } from "@ndla/icons/action";
import { SafeLinkButton } from "@ndla/safelink";
import Overlay from "../Overlay";

const StyledDropdownContent = styled(DropdownContent)`
  padding: ${spacing.normal};
`;

const StyledArrow = styled(DropdownMenuArrow)`
  fill: ${colors.white};
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  justify-content: flex-start;
`;

const LanguagePicker = ({ id, emptyLanguages, editUrl }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        {!!emptyLanguages.length && (
          <DropdownTrigger asChild>
            <ButtonV2 size="small" variant="ghost">
              <Plus /> {t("form.variant.create")}
            </ButtonV2>
          </DropdownTrigger>
        )}
        <StyledDropdownContent>
          <StyledArrow width={20} height={10} />
          {emptyLanguages.map((language) => (
            <DropdownItem key={language.key} asChild>
              <StyledSafeLinkButton variant="tertiary" to={editUrl(id, language.key)}>
                {language.title}
              </StyledSafeLinkButton>
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
