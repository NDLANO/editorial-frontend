/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, InProgress } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";
import { isApproachingRevision } from "./ApproachingRevisionDate";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import WrongTypeError from "./WrongTypeError";
import { getWarnStatus, StyledTimeIcon } from "../../../components/HeaderWithLanguage/HeaderStatusInformation";
import formatDate from "../../../util/formatDate";
import { getExpirationDate } from "../../ArticlePage/articleTransformers";

const StyledWarnIcon = styled(AlertCircle, {
  base: {
    fill: "surface.warning",
  },
});

const IconWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

interface Props {
  contentMetaLoading: boolean;
  resource: ResourceWithNodeConnectionAndMeta;
  multipleTaxonomy: boolean;
  path?: string;
}

const StatusIcons = ({ contentMetaLoading, resource, multipleTaxonomy, path }: Props) => {
  const { t } = useTranslation();
  const approachingRevision = useMemo(
    () => isApproachingRevision(resource.contentMeta?.revisions),
    [resource.contentMeta?.revisions],
  );
  const expirationDate = getExpirationDate({
    revisions: resource.contentMeta?.revisions?.filter((r) => !!r)!,
  });
  const expirationColor = getWarnStatus(expirationDate);

  const expirationText = useMemo(() => {
    if (expirationColor && expirationDate) {
      return t(`form.workflow.expiration.${expirationColor}`, {
        date: formatDate(expirationDate),
      });
    }
    return undefined;
  }, [expirationColor, expirationDate, t]);

  return (
    <IconWrapper>
      {resource.contentMeta?.started && (
        <InProgress aria-label={t("taxonomy.inProgress")} title={t("taxonomy.inProgress")} />
      )}
      {approachingRevision && expirationColor && expirationDate && (
        <StyledTimeIcon data-status={expirationColor} aria-label={expirationText} title={expirationText} />
      )}
      {!contentMetaLoading && <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />}
      {multipleTaxonomy && (
        <StyledWarnIcon aria-label={t("form.workflow.multipleTaxonomy")} title={t("form.workflow.multipleTaxonomy")} />
      )}
    </IconWrapper>
  );
};

export default StatusIcons;
