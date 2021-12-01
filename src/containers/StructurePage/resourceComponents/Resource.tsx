/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
//@ts-ignore
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing, breakpoints } from '@ndla/core';
import { AlertCircle, Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { useQuery, useQueryClient } from 'react-query';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import GrepCodesModal from '../../GrepCodes/GrepCodesModal';
import RemoveButton from '../../../components/RemoveButton';
import ResourceItemLink from './ResourceItemLink';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import config from '../../../config';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';
import { DraftStatus, DraftStatusTypes } from '../../../modules/draft/draftApiInterfaces';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import { ResourceWithNodeConnection } from '../../../modules/taxonomy/nodes/nodeApiTypes';
import {
  usePutResourceForNodeMutation,
  useUpdateNodeConnectionMutation,
} from '../../../modules/taxonomy/nodes/nodeMutations';
import { NODE_RESOURCE_STATUS_GREP_QUERY } from '../../../queryKeys';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const StyledWarnIcon = styled(AlertCircle)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.red};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

interface Props {
  resource: ResourceWithNodeConnection;
  onDelete?: (connectionId: string) => void;
  updateResource?: (resource: ResourceWithNodeConnection) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  id?: string; // required for MakeDndList, otherwise ignored
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

const getArticleTypeFromId = (id?: string) => {
  if (id?.startsWith('urn:topic:')) return 'topic-article';
  else if (id?.startsWith('urn:resource:')) return 'standard';
  return undefined;
};

interface ResourceWithGrepAndStatus extends ResourceWithNodeConnection {
  grepCodes?: string[];
  status?: DraftStatus;
  articleType?: string;
}

const Resource = ({ resource: initialResource, onDelete, dragHandleProps }: Props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showGrepCodes, setShowGrepCodes] = useState(false);
  const qc = useQueryClient();
  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation();
  const { mutateAsync: updateResourceConnection } = usePutResourceForNodeMutation();

  const getGrepCodesAndStatus = async (resource: ResourceWithGrepAndStatus) => {
    const [, resourceType, id] = resource.contentUri?.split(':') ?? [];
    if (id && resourceType === 'article') {
      const { status, grepCodes, articleType } = await fetchDraft(id, i18n.language);
      return { ...resource, status, grepCodes, articleType };
    } else if (id && resourceType === 'learningpath') {
      const learningpath = await fetchLearningpath(parseInt(id), i18n.language);
      if (learningpath.status) {
        const status = { current: learningpath.status as DraftStatusTypes, other: [] };
        return { ...resource, status };
      }
    }
    return resource;
  };

  const { data, isLoading } = useQuery<ResourceWithGrepAndStatus>(
    [NODE_RESOURCE_STATUS_GREP_QUERY, initialResource.id],
    () => getGrepCodesAndStatus(initialResource),
    { retry: false, initialData: initialResource },
  );

  const resource = data!;

  if (isLoading) {
    return <div {...dragHandleProps} />;
  }

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
      : 'topic-article';

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  const structurePaths: string[] = history.location.pathname.replace('/structure', '').split('/');
  const currentPath = structurePaths.map(p => p.replace('urn:', '')).join('/');
  const path = resource.paths.find(p => {
    const pArr = p.split('/');
    const isResource = pArr[pArr.length - 1].startsWith('resource');
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join('/');
    return pathWithoutResource === currentPath;
  });

  const onGrepModalClosed = async (newGrepCodes?: string[]) => {
    setShowGrepCodes(false);
    const compKey = [NODE_RESOURCE_STATUS_GREP_QUERY, resource.id];
    qc.cancelQueries(compKey);
    const resourceWithNewGrep: ResourceWithGrepAndStatus = { ...resource, grepCodes: newGrepCodes };
    qc.setQueryData<ResourceWithGrepAndStatus>(compKey, resourceWithNewGrep);
    await qc.invalidateQueries(compKey);
  };

  const updateRelevanceId = async (relevanceId: string) => {
    const { connectionId, primary, rank } = resource;
    const func = connectionId.includes('topic-resource')
      ? updateResourceConnection
      : updateNodeConnection;
    await func({ id: connectionId, body: { relevanceId, primary, rank: rank } });
  };

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
      <WrongTypeError resource={resource} />
      {(resource.status?.current === PUBLISHED || resource.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
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
      <RelevanceOption relevanceId={resource.relevanceId} onChange={updateRelevanceId} />

      {onDelete && <RemoveButton onClick={() => onDelete(resource.connectionId)} />}
      {showVersionHistory && (
        <VersionHistoryLightbox
          onClose={() => setShowVersionHistory(false)}
          contentUri={resource.contentUri}
          contentType={contentType}
          name={resource.name}
          isVisible={resource.metadata?.visible}
        />
      )}
      {showGrepCodes && (
        <GrepCodesModal onClose={onGrepModalClosed} contentUri={resource.contentUri} />
      )}
    </StyledText>
  );
};

const PublishedWrapper = ({ path, children }: { path?: string; children: React.ReactElement }) => {
  if (!path) {
    return children;
  }
  return (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${path}`}>
      {children}
    </StyledLink>
  );
};

const WrongTypeError = ({ resource }: { resource: ResourceWithGrepAndStatus }) => {
  const { t } = useTranslation();
  const isArticle = resource.contentUri?.startsWith('urn:article');
  if (!isArticle) return null;

  const expectedArticleType = getArticleTypeFromId(resource.id);
  if (expectedArticleType === resource.articleType) return null;

  const missingArticleTypeError = t('taxonomy.info.missingArticleType', {
    id: getIdFromUrn(resource.contentUri),
  });

  const wrongArticleTypeError = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.${expectedArticleType}`),
    isType: t(`articleType.${resource.articleType}`),
  });

  const errorText = resource.articleType ? wrongArticleTypeError : missingArticleTypeError;

  return (
    <Tooltip tooltip={errorText}>
      <StyledWarnIcon title={undefined} />
    </Tooltip>
  );
};

export default Resource;
