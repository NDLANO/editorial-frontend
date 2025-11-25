/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningFill, FileEditLine } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild } from "@ndla/types-taxonomy";
import { isApproachingRevision } from "./ApproachingRevisionDate";
import WrongTypeError from "./WrongTypeError";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import { StatusTimeFill } from "../../../components/StatusTimeFill";
import { NodeResourceMeta } from "../../../modules/nodes/nodeApiTypes";
import formatDate from "../../../util/formatDate";
import { getExpirationStatus } from "../../../util/getExpirationStatus";
import { getExpirationDate } from "../../../util/revisionHelpers";
import { usePreferences } from "../PreferencesProvider";

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

interface Props {
  nodeResourcesIsPending: boolean;
  resource: NodeChild;
  contentMeta: NodeResourceMeta | undefined;
  multipleTaxonomy: boolean;
}

const StatusIcons = ({ nodeResourcesIsPending, resource, multipleTaxonomy, contentMeta }: Props) => {
  const { t } = useTranslation();
  const { showHearts } = usePreferences();
  const approachingRevision = useMemo(() => isApproachingRevision(contentMeta?.revisions), [contentMeta?.revisions]);
  const expirationDate = getExpirationDate(contentMeta?.revisions?.filter((r) => !!r) ?? []);
  const warnStatus = getExpirationStatus(expirationDate);

  const expirationText = useMemo(() => {
    if (expirationDate && warnStatus) {
      return t(`form.workflow.expiration.${warnStatus}`, {
        date: formatDate(expirationDate),
      });
    }
    return undefined;
  }, [expirationDate, t, warnStatus]);

  return (
    <>
      {!!contentMeta?.started && (
        <FileEditLine aria-label={t("taxonomy.inProgress")} title={t("taxonomy.inProgress")} />
      )}
      {!!approachingRevision && !!warnStatus && !!expirationDate && (
        <StatusTimeFill variant={warnStatus} aria-label={expirationText} title={expirationText} />
      )}
      {!nodeResourcesIsPending && <WrongTypeError resource={resource} articleType={contentMeta?.articleType} />}
      {!!multipleTaxonomy && (
        <StyledErrorWarningFill
          aria-label={t("form.workflow.multipleTaxonomy")}
          title={t("form.workflow.multipleTaxonomy")}
        />
      )}
      {!!showHearts && <HeaderFavoriteStatus id={contentMeta?.id} type={contentMeta?.articleType ?? "learningpath"} />}
    </>
  );
};

export default StatusIcons;
