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
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, fonts } from "@ndla/core";
import { DropdownItem, DropdownContent, DropdownMenu, DropdownTrigger } from "@ndla/dropdown-menu";
import { PersonOutlined } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import Overlay from "../../../components/Overlay";
import { getAccessTokenPersonal } from "../../../util/authHelpers";
import { toLogoutSession, toLogin } from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledUserIcon = styled(PersonOutlined)`
  color: ${colors.brand.primary};
  width: ${spacing.normal};
  height: ${spacing.normal};
`;

const StyledUserButton = styled(ButtonV2)`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};

  &:hover,
  &:focus-visible {
    color: ${colors.black};
  }
`;

const StyledDropdownContent = styled(DropdownContent)`
  padding: ${spacing.normal};
`;

const StyledArrow = styled(DropdownMenuArrow)`
  fill: ${colors.white};
`;

const SessionContainer = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { userName, authenticated } = useSession();

  const isAccessTokenPersonal = getAccessTokenPersonal();

  if (authenticated && isAccessTokenPersonal) {
    return (
      <>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          {!!authenticated && isAccessTokenPersonal && (
            <DropdownTrigger asChild>
              <StyledUserButton variant="ghost" colorTheme="lighter" shape="pill">
                <StyledUserIcon />
                {userName?.split(" ")[0]}
              </StyledUserButton>
            </DropdownTrigger>
          )}
          <StyledDropdownContent>
            <StyledArrow width={20} height={10} />
            <DropdownItem asChild>
              <SafeLinkButton variant="secondary" to={toLogoutSession()}>
                {t("logoutProviders.localLogout")}
              </SafeLinkButton>
            </DropdownItem>
          </StyledDropdownContent>
        </DropdownMenu>
        {open && <Overlay modifiers={["zIndex"]} />}
      </>
    );
  }

  return (
    <div>
      <Link to={toLogin()}>{t("siteNav.login")}</Link>
    </div>
  );
};

export default SessionContainer;
