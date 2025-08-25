/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PageContainer } from "@ndla/primitives";
import { ErrorMessage } from "@ndla/ui";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageContainer asChild consumeCss>
      <main>
        <ErrorMessage
          illustration={{
            url: "/not-exist.gif",
            altText: t("errorMessage.title"),
          }}
          messages={{
            title: t("errorMessage.title"),
            description: t("notFound.description"),
            back: t("errorMessage.back"),
            goToFrontPage: t("errorMessage.goToFrontPage"),
          }}
        />
      </main>
    </PageContainer>
  );
};

export const Component = NotFound;

export default NotFound;
