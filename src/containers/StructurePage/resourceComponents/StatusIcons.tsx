/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { AlertCircle, CheckboxCircleFill, InProgress } from "@ndla/icons/editor";
import { SafeLink } from "@ndla/safelink";
import { isApproachingRevision } from "./ApproachingRevisionDate";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import WrongTypeError from "./WrongTypeError";
import { getWarnStatus, StyledTimeIcon } from "../../../components/HeaderWithLanguage/HeaderStatusInformation";
import config from "../../../config";
import { PUBLISHED } from "../../../constants";
import formatDate from "../../../util/formatDate";
import { getExpirationDate } from "../../ArticlePage/articleTransformers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const StyledCheckIcon = styled(CheckboxCircleFill)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const StyledWarnIcon = styled(AlertCircle)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.yellow};
`;

const StyledInProgressIcon = styled(InProgress)`
  width: 24px;
  height: 24px;
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const CheckedWrapper = styled.div`
  display: flex;
`;
const TimeIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
`;

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
        <IconWrapper>
          <StyledInProgressIcon aria-label={t("taxonomy.inProgress")} title={t("taxonomy.inProgress")} />
        </IconWrapper>
      )}
      {approachingRevision ? (
        <>
          {expirationColor && expirationDate && (
            <TimeIconWrapper>
              <StyledTimeIcon data-status={expirationColor} aria-label={expirationText} title={expirationText} />
            </TimeIconWrapper>
          )}
        </>
      ) : null}
      {!contentMetaLoading && <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />}
      {multipleTaxonomy && (
        <IconWrapper>
          <StyledWarnIcon
            aria-label={t("form.workflow.multipleTaxonomy")}
            title={t("form.workflow.multipleTaxonomy")}
          />
        </IconWrapper>
      )}
      {(resource.contentMeta?.status?.current === PUBLISHED ||
        resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
          <CheckedWrapper>
            <StyledCheckIcon aria-label={t("form.workflow.published")} title={t("form.workflow.published")} />
          </CheckedWrapper>
        </PublishedWrapper>
      )}
    </IconWrapper>
  );
};

const PublishedWrapper = ({ path, children }: { path?: string; children: ReactElement }) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  if (!path) {
    return children;
  }
  return (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}>
      {children}
    </StyledLink>
  );
};

export default StatusIcons;
