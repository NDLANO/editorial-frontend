/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing, breakpoints } from '@ndla/core';
import { AlertCircle, Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { useQuery, useQueryClient } from 'react-query';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
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
import { RESOURCES_WITH_NODE_CONNECTION, RESOURCE_META } from '../../../queryKeys';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import config from '../../../config';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import RelevanceOption from '../components/RelevanceOption';
import RemoveButton from '../../../components/RemoveButton';
import { classes } from './ResourceGroup';
import ResourceItemLink from './ResourceItemLink';

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
  currentNodeId: string;
  connectionId?: string; // required for MakeDndList, otherwise ignored
  id?: string; // required for MakeDndList, otherwise ignored
  resource: ResourceWithNodeConnection;
  onDelete?: (connectionId: string) => void;
  updateResource?: (resource: ResourceWithNodeConnection) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
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

interface ResourceMeta {
  grepCodes?: string[];
  status?: { current: string; other: string[] };
  articleType?: string;
}

const Resource = ({ resource, onDelete, dragHandleProps, currentNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showGrepCodes, setShowGrepCodes] = useState(false);
  const qc = useQueryClient();

  const onUpdateConnection = async (id: string, { relevanceId }: NodeConnectionPutType) => {
    const key = [RESOURCES_WITH_NODE_CONNECTION, currentNodeId, { language: i18n.language }];
    await qc.cancelQueries(key);
    const resources = qc.getQueryData<ResourceWithNodeConnection[]>(key) ?? [];
    if (relevanceId) {
      const newResources = resources.map(res => {
        if (res.id === id) {
          return { ...res, relevanceId: relevanceId };
        } else return res;
      });
      qc.setQueryData<ResourceWithNodeConnection[]>(key, newResources);
    }
    return resources;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () =>
      qc.invalidateQueries([
        RESOURCES_WITH_NODE_CONNECTION,
        currentNodeId,
        { language: i18n.language },
      ]),
  });
  const { mutateAsync: updateResourceConnection } = usePutResourceForNodeMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () =>
      qc.invalidateQueries([
        RESOURCES_WITH_NODE_CONNECTION,
        currentNodeId,
        { language: i18n.language },
      ]),
  });

  const getArticleMeta = async (resource: ResourceWithNodeConnection): Promise<ResourceMeta> => {
    const [, resourceType, id] = resource.contentUri?.split(':') ?? [];
    if (id && resourceType === 'article') {
      const { status, grepCodes, articleType } = await fetchDraft(id, i18n.language);
      return { status, grepCodes, articleType };
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
    [RESOURCE_META, resource.id],
    () => getArticleMeta(resource),
    { retry: false, initialData: {} },
  );

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
      : 'topic-article';

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  const structurePaths: string[] = location.pathname.replace('/structureBeta', '').split('/');
  const currentPath = structurePaths.map(p => p.replace('urn:', '')).join('/');
  const path = resource.paths.find(p => {
    const pArr = p.split('/');
    const isResource = pArr[pArr.length - 1].startsWith('resource');
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join('/');
    return pathWithoutResource === currentPath;
  });

  // const onGrepModalClosed = async (newGrepCodes?: string[]) => {
  //   setShowGrepCodes(false);
  //   const compKey = [NODE_RESOURCE_STATUS_GREP_QUERY, resource.id];
  //   qc.cancelQueries(compKey);
  //   const resourceWithNewGrep: ResourceWithGrepAndStatus = { ...resource, grepCodes: newGrepCodes };
  //   qc.setQueryData<ResourceWithGrepAndStatus>(compKey, resourceWithNewGrep);
  //   await qc.invalidateQueries(compKey);
  // };

  const updateRelevanceId = async (relevanceId: string) => {
    const { connectionId, primary, rank } = resource;
    const func = connectionId.includes('subject-topic')
      ? updateNodeConnection
      : updateResourceConnection;
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
      {resourceMetaQuery.data?.status?.current && (
        <Button
          lighter
          css={statusButtonStyle}
          onClick={() => setShowVersionHistory(true)}
          disabled={contentType === 'learning-path'}>
          {t(`form.status.${resourceMetaQuery.data.status.current.toLowerCase()}`)}
        </Button>
      )}
      <WrongTypeError resource={resource} articleType={resourceMetaQuery.data?.articleType} />
      {(resourceMetaQuery.data?.status?.current === PUBLISHED ||
        resourceMetaQuery.data?.status?.other?.includes(PUBLISHED)) && (
        <PublishedWrapper path={path}>
          <Tooltip tooltip={t('form.workflow.published')}>
            <StyledCheckIcon />
          </Tooltip>
        </PublishedWrapper>
      )}
      {contentType !== 'learning-path' && (
        <Button lighter css={grepButtonStyle} onClick={() => setShowGrepCodes(true)}>
          {`GREP (${resourceMetaQuery.data?.grepCodes?.length || 0})`}
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
          locale={i18n.language}
        />
      )}
      {/* {showGrepCodes && (
        <GrepCodesModal onClose={onGrepModalClosed} contentUri={resource.contentUri} />
      )} */}
    </StyledText>
  );
};

const PublishedWrapper = ({ path, children }: { path?: string; children: ReactElement }) => {
  if (!path) {
    return children;
  }
  return (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${path}`}>
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
