/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing, breakpoints } from '@ndla/core';
import { HumanMaleBoard } from '@ndla/icons/common';
import { AlertCircle, Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { useQuery, useQueryClient } from 'react-query';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import {
  NodeConnectionPutType,
  ResourceWithNodeConnection,
} from '../../../modules/nodes/nodeApiTypes';
import {
  usePutResourceForNodeMutation,
  useUpdateNodeConnectionMutation,
} from '../../../modules/nodes/nodeMutations';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';
import { RESOURCE_META } from '../../../queryKeys';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import config from '../../../config';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import RelevanceOption from '../../../components/Taxonomy/RelevanceOption';
import RemoveButton from '../../../components/Taxonomy/RemoveButton';
import ResourceItemLink from './ResourceItemLink';
import GrepCodesModal from './GrepCodesModal';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { resourcesWithNodeConnectionQueryKey } from '../../../modules/nodes/nodeQueries';

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

const StyledAvailability = styled(HumanMaleBoard)`
  height: 24px;
  width: 24px;
  fill: ${colors.brand.grey};
`;

const StyledStatusButton = styled(Button)`
  margin-right: ${spacing.xsmall};
`;

interface Props {
  currentNodeId: string;
  connectionId?: string; // required for MakeDndList, otherwise ignored
  id?: string; // required for MakeDndList, otherwise ignored
  resource: ResourceWithNodeConnection;
  onDelete?: (connectionId: string) => void;
  updateResource?: (resource: ResourceWithNodeConnection) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}
const StyledGrepButton = styled(Button)`
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

interface ResourceMeta {
  grepCodes?: string[];
  status?: { current: string; other: string[] };
  articleType?: string;
  availability?: string;
}

const Resource = ({ resource, onDelete, dragHandleProps, currentNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showGrepCodes, setShowGrepCodes] = useState(false);
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = resourcesWithNodeConnectionQueryKey({
    id: currentNodeId,
    language: i18n.language,
  });

  const onUpdateConnection = async (id: string, { relevanceId }: NodeConnectionPutType) => {
    await qc.cancelQueries(compKey);
    const resources = qc.getQueryData<ResourceWithNodeConnection[]>(compKey) ?? [];
    if (relevanceId) {
      const newResources = resources.map(res => {
        if (res.id === id) {
          return { ...res, relevanceId: relevanceId };
        } else return res;
      });
      qc.setQueryData<ResourceWithNodeConnection[]>(compKey, newResources);
    }
    return resources;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries(compKey),
  });
  const { mutateAsync: updateResourceConnection } = usePutResourceForNodeMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries(compKey),
  });

  const getArticleMeta = async (resource: ResourceWithNodeConnection): Promise<ResourceMeta> => {
    const [, resourceType, id] = resource.contentUri?.split(':') ?? [];
    if (id && resourceType === 'article') {
      const { status, grepCodes, articleType, availability } = await fetchDraft(id, i18n.language);
      return { status, grepCodes, articleType, availability };
    } else if (id && resourceType === 'learningpath') {
      const learningpath = await fetchLearningpath(parseInt(id), i18n.language);
      if (learningpath.status) {
        const status = { current: learningpath.status, other: [] };
        return { ...resource, status };
      }
    }
    return {};
  };

  const resourceMetaQuery = useQuery<ResourceMeta>(
    [RESOURCE_META, { id: resource.id }],
    () => getArticleMeta(resource),
    { retry: false, initialData: {} },
  );

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
      : 'topic-article';

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  const structurePaths: string[] = location.pathname.replace('/structure', '').split('/');
  const currentPath = structurePaths.map(p => p.replace('urn:', '')).join('/');
  const path = resource.paths.find(p => {
    const pArr = p.split('/');
    const isResource = pArr[pArr.length - 1].startsWith('resource');
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join('/');
    return pathWithoutResource === currentPath;
  });

  const onGrepModalClosed = async (newGrepCodes?: string[]) => {
    setShowGrepCodes(false);
    if (!newGrepCodes || isEqual(newGrepCodes, resourceMetaQuery.data?.grepCodes)) return;
    const compKey = [RESOURCE_META, resource.id];
    qc.cancelQueries(compKey);
    const resourceWithNewGrep: ResourceMeta = { ...resource, grepCodes: newGrepCodes };
    qc.setQueryData<ResourceMeta>(compKey, resourceWithNewGrep);
    await qc.invalidateQueries(compKey);
  };

  const updateRelevanceId = async (relevanceId: string) => {
    const { connectionId, primary, rank } = resource;
    const func = connectionId.includes('-resource')
      ? updateResourceConnection
      : updateNodeConnection;
    await func({
      id: connectionId,
      body: { relevanceId, primary, rank: rank },
      taxonomyVersion,
    });
  };

  return (
    <StyledText data-testid={`resource-type-${contentType}`} className="o-flag o-flag--top">
      {contentType && (
        <StyledResourceIcon key="img" className=" o-flag__img" {...dragHandleProps}>
          <ContentTypeBadge background type={iconType} />
        </StyledResourceIcon>
      )}
      <StyledResourceBody key="body" className="o-flag__body">
        <ResourceItemLink
          contentType={contentType}
          contentUri={resource.contentUri}
          name={resource.name}
          isVisible={resource.metadata?.visible}
        />
      </StyledResourceBody>
      {resourceMetaQuery.data?.status?.current && (
        <StyledStatusButton
          lighter
          onClick={() => setShowVersionHistory(true)}
          disabled={contentType === 'learning-path'}>
          {t(`form.status.${resourceMetaQuery.data.status.current.toLowerCase()}`)}
        </StyledStatusButton>
      )}
      <WrongTypeError resource={resource} articleType={resourceMetaQuery.data?.articleType} />
      {resourceMetaQuery.data?.availability === 'teacher' && (
        <Tooltip tooltip={t('form.availability.forTeacher')}>
          <StyledAvailability />
        </Tooltip>
      )}
      {(resourceMetaQuery.data?.status?.current === PUBLISHED ||
        resourceMetaQuery.data?.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
          <Tooltip tooltip={t('form.workflow.published')}>
            <StyledCheckIcon />
          </Tooltip>
        </PublishedWrapper>
      )}
      {contentType !== 'learning-path' && (
        <StyledGrepButton lighter onClick={() => setShowGrepCodes(true)}>
          {`GREP (${resourceMetaQuery.data?.grepCodes?.length || 0})`}
        </StyledGrepButton>
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
          locale={i18n.language}
        />
      )}
      {showGrepCodes && resource.contentUri && (
        <GrepCodesModal onClose={onGrepModalClosed} contentUri={resource.contentUri} />
      )}
    </StyledText>
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
      to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}>
      {children}
    </StyledLink>
  );
};

const WrongTypeError = ({
  resource,
  articleType,
}: {
  resource: ResourceWithNodeConnection;
  articleType?: string;
}) => {
  const { t } = useTranslation();
  const isArticle = resource.contentUri?.startsWith('urn:article');
  if (!isArticle) return null;

  const expectedArticleType = getArticleTypeFromId(resource.id);
  if (expectedArticleType === articleType) return null;

  const missingArticleTypeError = t('taxonomy.info.missingArticleType', {
    id: getIdFromUrn(resource.contentUri),
  });

  const wrongArticleTypeError = t('taxonomy.info.wrongArticleType', {
    placedAs: t(`articleType.${expectedArticleType}`),
    isType: t(`articleType.${articleType}`),
  });

  const errorText = articleType ? wrongArticleTypeError : missingArticleTypeError;

  return (
    <Tooltip tooltip={errorText}>
      <StyledWarnIcon title={undefined} />
    </Tooltip>
  );
};

export default Resource;
