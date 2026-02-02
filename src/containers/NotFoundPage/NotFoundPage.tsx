/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ErrorMessageActions,
  ErrorMessageContent,
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
  PageContainer,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageContainer asChild consumeCss>
      <main>
        <ErrorMessageRoot>
          <title>{t("htmlTitles.notFoundPage")}</title>
          <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
          <ErrorMessageContent>
            <ErrorMessageTitle>{t("errorMessage.title")}</ErrorMessageTitle>
            <ErrorMessageDescription>{t("notFound.description")}</ErrorMessageDescription>
          </ErrorMessageContent>
          <ErrorMessageActions>
            <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
          </ErrorMessageActions>
        </ErrorMessageRoot>
      </main>
    </PageContainer>
  );
};

export const Component = NotFound;

export default NotFound;
