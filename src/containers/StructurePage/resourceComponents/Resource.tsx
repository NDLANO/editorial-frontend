/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
//@ts-ignore
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing, breakpoints } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import GrepCodesModal from '../../GrepCodes/GrepCodesModal';
import RemoveButton from '../../../components/RemoveButton';
import ResourceItemLink from './ResourceItemLink';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import { Resource as ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatus } from '../../../modules/draft/draftApiInterfaces';
import config from '../../../config';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

interface Props {
  resource: ResourceType & { status?: DraftStatus };
  onDelete?: (connectionId: string) => void;
  connectionId: string;
  dragHandleProps?: object;
  locale: string;
  relevanceId?: string;
  updateRelevanceId?: (
    connectionId: string,
    body: { primary?: boolean; rank?: number; relevanceId?: string },
  ) => Promise<void>;
  primary?: boolean;
  rank?: number;
}
const grepButtonStyle = css`
  margin-left: ${spacing.xsmall};
`;

const StyledResourceIcon = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  width: 42px;
  box-sizing: content-box;
  padding-right: ${spacing.small};

  @media (min-width: ${breakpoints.tablet}) {
    padding-right: ${spacing.normal};
  }
`;

const StyledResourceBody = styled.div`
  flex: 1 1 auto;
  justify-content: space-between;
  text-align: left;
`;

const StyledText = styled.div`
  display: flex;
  padding: 10px;
  margin-bottom: 6.5px;
  box-shadow: none;
  align-items: center;
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const Resource = ({
  resource,
  onDelete,
  connectionId,
  dragHandleProps = {},
  locale,
  relevanceId,
  updateRelevanceId,
  primary,
  rank,
}: Props) => {
  const { t } = useTranslation();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showGrepCodes, setShowGrepCodes] = useState(false);

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
      : 'topic-article';

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  const paths = [resource.path, ...resource.paths];
  const structurePaths = window.location.pathname.replace('/structure/', '').split('/');
  const subjectId = structurePaths[0].replace('urn:', '/');
  const parent = (structurePaths[structurePaths.length - 2] ?? subjectId).replace('urn:', '');
  const path = paths.find(p => {
    const currentPaths = p.substr(1).split('/');
    return p.startsWith(subjectId) && currentPaths[currentPaths.length - 2] === parent;
  });

  const PublishedWrapper = ({ children }: { children: React.ReactElement }) =>
    !path ? (
      children
    ) : (
      <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${path}`}>
        {children}
      </StyledLink>
    );

  return (
    <StyledText
      data-testid={`resource-type-${contentType}`}
      {...classes('text o-flag o-flag--top')}>
      {contentType && (
        <StyledResourceIcon key="img" {...classes('icon o-flag__img')} {...dragHandleProps}>
          <ContentTypeBadge background type={iconType} />
        </StyledResourceIcon>
      )}
      <StyledResourceBody key="body" {...classes('body o-flag__body')}>
        <ResourceItemLink
          contentType={contentType}
          contentUri={resource.contentUri}
          locale={locale}
          name={resource.name}
          isVisible={resource.metadata?.visible}
        />
      </StyledResourceBody>
      {resource.status?.current && (
        <Button
          lighter
          css={statusButtonStyle}
          onClick={() => setShowVersionHistory(true)}
          disabled={contentType === 'learning-path'}>
          {t(`form.status.${resource.status.current.toLowerCase()}`)}
        </Button>
      )}
      {(resource.status?.current === PUBLISHED || resource.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper>
          <Tooltip tooltip={t('form.workflow.published')}>
            <StyledCheckIcon />
          </Tooltip>
        </PublishedWrapper>
      )}
      {contentType !== 'learning-path' && (
        <Button lighter css={grepButtonStyle} onClick={() => setShowGrepCodes(true)}>
          {`GREP (${resource.grepCodes?.length || 0})`}
        </Button>
      )}
      <RelevanceOption
        relevanceId={relevanceId}
        onChange={relevanceIdUpdate =>
          updateRelevanceId?.(connectionId, {
            relevanceId: relevanceIdUpdate,
            primary,
            rank,
          })
        }
      />

      {onDelete && <RemoveButton onClick={() => onDelete(connectionId)} />}
      {showVersionHistory && (
        <VersionHistoryLightbox
          onClose={() => setShowVersionHistory(false)}
          contentUri={resource.contentUri}
          contentType={contentType}
          name={resource.name}
          isVisible={resource.metadata?.visible}
          locale={locale}
        />
      )}
      {showGrepCodes && (
        <GrepCodesModal
          onClose={() => setShowGrepCodes(false)}
          contentUri={resource.contentUri}
          locale={locale}
        />
      )}
    </StyledText>
  );
};

export default Resource;
