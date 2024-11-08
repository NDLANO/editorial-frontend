/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { UserLine } from "@ndla/icons/common";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { getAccessTokenPersonal } from "../../../util/authHelpers";
import { routes } from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    whiteSpace: "nowrap",
  },
});

export const MastheadSessionLink = (props: Omit<SafeLinkButtonProps, "to" | "children">) => {
  const { t } = useTranslation();
  const { authenticated } = useSession();
  const isAccessTokenPersonal = getAccessTokenPersonal();

  const loggedIn = authenticated && isAccessTokenPersonal;

  return (
    <StyledSafeLinkButton
      variant="tertiary"
      size="small"
      to={loggedIn ? routes.logout.logoutSession : routes.login}
      {...props}
    >
      <UserLine />
      {loggedIn ? t("user.buttonLogOut") : t("siteNav.login")}
    </StyledSafeLinkButton>
  );
};
