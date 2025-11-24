/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  ErrorMessageActions,
  ErrorMessageContent,
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";

export const LearningpathErrorMessage = () => {
  const { t } = useTranslation();
  return (
    <ErrorMessageRoot>
      <img src="/static/oops.gif" alt={t("errorMessage.title")} />
      <ErrorMessageContent>
        <ErrorMessageTitle>{t("errorMessage.title")}</ErrorMessageTitle>
        <ErrorMessageDescription>{t("learningpathForm.genericError")}</ErrorMessageDescription>
      </ErrorMessageContent>
      <ErrorMessageActions>
        <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
      </ErrorMessageActions>
    </ErrorMessageRoot>
  );
};
