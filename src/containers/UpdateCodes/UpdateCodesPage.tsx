/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { useMigrateCodes } from "../../modules/draft/draftMutations";
import NotFound from "../NotFoundPage/NotFoundPage";
import { useSession } from "../Session/SessionProvider";

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "medium",
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "small",
  },
});

const UpdateCodesPage = () => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { mutateAsync: migrateCode, isError, isPending } = useMigrateCodes();

  if (!userPermissions?.includes(DRAFT_ADMIN_SCOPE)) {
    return <NotFound />;
  }

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <title>{t("updateCodesPage.title")}</title>
        <Heading textStyle="heading.medium">{t("updateCodesPage.title")}</Heading>
        <Wrapper>
          <Text>{t("updateCodesPage.description")}</Text>
          <Button onClick={() => migrateCode()} loading={isPending} disabled={isPending}>
            {t("updateCodesPage.buttonText")}
          </Button>
          {isError ? (
            <Text color="text.error" aria-live="polite">
              {t("updateCodesPage.error")}
            </Text>
          ) : null}
        </Wrapper>
      </main>
    </StyledPageContainer>
  );
};
export default UpdateCodesPage;
