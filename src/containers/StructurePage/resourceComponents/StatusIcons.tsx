/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { AlertCircle, Check, InProgress } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import config from '../../../config';
import { PUBLISHED } from '../../../constants';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { isApproachingRevision } from './ApproachingRevisionDate';
import WrongTypeError from './WrongTypeError';
import {
  getWarnStatus,
  StyledTimeIcon,
} from '../../../components/HeaderWithLanguage/HeaderStatusInformation';
import { getExpirationDate } from '../../ArticlePage/articleTransformers';
import formatDate from '../../../util/formatDate';

const StyledCheckIcon = styled(Check)`
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
  path?: string;
}

const StatusIcons = ({ contentMetaLoading, resource, path }: Props) => {
  const { t } = useTranslation();
  const approachingRevision = useMemo(
    () => isApproachingRevision(resource.contentMeta?.revisions),
    [resource.contentMeta?.revisions],
  );
  const expirationDate = getExpirationDate({
    revisions: resource.contentMeta?.revisions?.filter((r) => !!r)!,
  });
  const expirationColor = getWarnStatus(expirationDate);

  return (
    <IconWrapper>
      {resource.contentMeta?.started && (
        <Tooltip tooltip={t('taxonomy.inProgress')}>
          <IconWrapper>
            <StyledInProgressIcon />
          </IconWrapper>
        </Tooltip>
      )}
      {approachingRevision ? (
        <>
          {expirationColor && expirationDate && (
            <Tooltip
              tooltip={t(`form.workflow.expiration.${expirationColor}`, {
                date: formatDate(expirationDate),
              })}
            >
              <TimeIconWrapper>
                <StyledTimeIcon status={expirationColor} width="24px" height="24px" />
              </TimeIconWrapper>
            </Tooltip>
          )}
        </>
      ) : null}
      {!contentMetaLoading && (
        <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />
      )}
      {resource.paths?.length > 1 && (
        <Tooltip tooltip={t('form.workflow.multipleTaxonomy')}>
          <IconWrapper>
            <StyledWarnIcon />
          </IconWrapper>
        </Tooltip>
      )}
      {(resource.contentMeta?.status?.current === PUBLISHED ||
        resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
          <Tooltip tooltip={t('form.workflow.published')}>
            <CheckedWrapper>
              <StyledCheckIcon />
            </CheckedWrapper>
          </Tooltip>
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
    <StyledLink
      target="_blank"
      to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}
    >
      {children}
    </StyledLink>
  );
};

export default StatusIcons;
