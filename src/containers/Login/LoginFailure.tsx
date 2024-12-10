/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useSession } from "../Session/SessionProvider";

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xsmall",
  },
});

export const LoginFailure = () => {
  const { t } = useTranslation();
  const { userNotRegistered } = useSession();
  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <Heading textStyle="heading.medium">{t("loginFailure.errorMessage")}</Heading>
        {!!userNotRegistered && <Text>{t("loginFailure.userNotRegistered")}</Text>}
        <Text>
          <Link to="/login">{t("loginFailure.loginLink")}</Link>
        </Text>
      </main>
    </StyledPageContainer>
  );
};

export default LoginFailure;
