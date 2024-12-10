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
import { isApproachingRevision } from "./ApproachingRevisionDate";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import WrongTypeError from "./WrongTypeError";
import { getWarnStatus } from "../../../components/HeaderWithLanguage/HeaderStatusInformation";
import { StatusTimeFill } from "../../../components/StatusTimeFill";
import formatDate from "../../../util/formatDate";
import { getExpirationDate } from "../../ArticlePage/articleTransformers";

const IconWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

interface Props {
  contentMetaLoading: boolean;
  resource: ResourceWithNodeConnectionAndMeta;
  multipleTaxonomy: boolean;
}

const StatusIcons = ({ contentMetaLoading, resource, multipleTaxonomy }: Props) => {
  const { t } = useTranslation();
  const approachingRevision = useMemo(
    () => isApproachingRevision(resource.contentMeta?.revisions),
    [resource.contentMeta?.revisions],
  );
  const expirationDate = getExpirationDate({
    revisions: resource.contentMeta?.revisions?.filter((r) => !!r) ?? [],
  });
  const warnStatus = getWarnStatus(expirationDate);

  const expirationText = useMemo(() => {
    if (expirationDate && warnStatus) {
      return t(`form.workflow.expiration.${warnStatus}`, {
        date: formatDate(expirationDate),
      });
    }
    return undefined;
  }, [expirationDate, t, warnStatus]);

  return (
    <IconWrapper>
      {!!resource.contentMeta?.started && (
        <FileEditLine aria-label={t("taxonomy.inProgress")} title={t("taxonomy.inProgress")} />
      )}
      {!!approachingRevision && !!warnStatus && !!expirationDate && (
        <StatusTimeFill variant={warnStatus} aria-label={expirationText} title={expirationText} />
      )}
      {!contentMetaLoading && <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />}
      {!!multipleTaxonomy && (
        <StyledErrorWarningFill
          aria-label={t("form.workflow.multipleTaxonomy")}
          title={t("form.workflow.multipleTaxonomy")}
        />
      )}
    </IconWrapper>
  );
};

export default StatusIcons;
