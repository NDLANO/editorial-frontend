/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckboxCircleFill } from "@ndla/icons";
import { SafeLinkIconButton } from "@ndla/safelink";
import { useTranslation } from "react-i18next";
import config from "../../config";

interface Props {
  type: "concept" | "article" | "learningpath";
  slugOrId: string | number;
}

export const ResourcePublishedLink = ({ type, slugOrId }: Props) => {
  const { t } = useTranslation();
  return (
    <SafeLinkIconButton
      variant="success"
      size="small"
      target="_blank"
      aria-label={t("form.workflow.published")}
      title={t("form.workflow.published")}
      to={`${config.ndlaFrontendDomain}/${type === "concept" ? "concept" : type === "learningpath" ? "learningpaths" : "article"}/${slugOrId}`}
    >
      <CheckboxCircleFill />
    </SafeLinkIconButton>
  );
};
