/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UserLine } from "@ndla/icons";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
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

  return (
    <StyledSafeLinkButton
      asAnchor
      variant="tertiary"
      size="small"
      to={authenticated ? routes.logout : routes.login}
      {...props}
    >
      <UserLine />
      {authenticated ? t("user.buttonLogOut") : t("siteNav.login")}
    </StyledSafeLinkButton>
  );
};
