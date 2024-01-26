/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { OneColumn } from "@ndla/ui";

const Forbidden = () => {
  const { t } = useTranslation();
  return (
    <OneColumn>
      <div>
        <h2>403 - {t("forbiddenPage.description")}</h2>
      </div>
    </OneColumn>
  );
};

export default Forbidden;
