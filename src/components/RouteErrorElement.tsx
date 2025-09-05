/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router";
import config from "../config";
import handleError from "../util/handleError";

export const ErrorElement = () => {
  const { t } = useTranslation();
  const error = useRouteError() as Error;
  if (config.runtimeType === "production") {
    handleError(error as Error);
  }
  if (error?.message)
    return (
      <div>
        <h1>{t("errorMessage.title")}</h1>
        <div>{error?.message}</div>
      </div>
    );
};
