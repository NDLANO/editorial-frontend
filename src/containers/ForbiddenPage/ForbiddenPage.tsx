/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading, PageContainer } from "@ndla/primitives";
import { useTranslation } from "react-i18next";

const Forbidden = () => {
  const { t } = useTranslation();
  return (
    <PageContainer asChild consumeCss>
      <main>
        <Heading textStyle="heading.medium">403 - {t("forbiddenPage.description")}</Heading>
      </main>
    </PageContainer>
  );
};

export const Component = Forbidden;
