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
import { ButtonV2 } from '@ndla/button';
import { colors, spacing, breakpoints } from '@ndla/core';
import { AlertCircle, Check, DragVertical } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { useQueryClient } from 'react-query';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import isEqual from 'lodash/isEqual';
import {
  NodeConnectionPutType,
  ResourceWithNodeConnection,
} from '../../../modules/nodes/nodeApiTypes';
import {
  usePutResourceForNodeMutation,
  useUpdateNodeConnectionMutation,
} from '../../../modules/nodes/nodeMutations';
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
import {
  NodeResourceMeta,
  nodeResourceMetasQueryKey,
  resourcesWithNodeConnectionQueryKey,
} from '../../../modules/nodes/nodeQueries';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: ${spacing.xsmall};
`;

const StyledCard = styled.div`
  border: 1px solid ${colors.brand.lighter};
  border-radius: 5px;
  width: 100%;
  padding: 5px;
  display: flex;
`;

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

const ButtonWithSpacing = styled(ButtonV2)`
  margin-left: ${spacing.xsmall};
  flex: 1;
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
  margin-bottom: ${spacing.xxsmall};
  box-shadow: none;
  align-items: center;
`;

const StyledLink = styled(SafeLink)`
  box-shadow: inset 0 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: 100%;
`;

const StyledDndIconWrapper = styled.div<{ isVisible: boolean }>`
  visibility: ${p => (p.isVisible ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
`;

const StyledDndIcon = styled(DragVertical)`
  height: 30px;
  width: 30px;
  color: ${colors.learningPath.light};
`;

const getArticleTypeFromId = (id?: string) => {
  if (id?.startsWith('urn:topic:')) return 'topic-article';
  else if (id?.startsWith('urn:resource:')) return 'standard';
  return undefined;
};

interface Props {
  currentNodeId: string;
  connectionId?: string; // required for MakeDndList, otherwise ignored
  id?: string; // required for MakeDndList, otherwise ignored
  resource: ResourceWithNodeConnectionAndMeta;
  onDelete?: (connectionId: string) => void;
  updateResource?: (resource: ResourceWithNodeConnection) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
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
    if (!newGrepCodes || isEqual(newGrepCodes, resource.contentMeta?.grepCodes)) return;
    const compKey = nodeResourceMetasQueryKey({ nodeId: currentNodeId, language: i18n.language });
    const metas = qc.getQueryData<NodeResourceMeta[]>(compKey) ?? [];
    const newMetas = metas.map(meta =>
      meta.contentUri === resource.contentMeta?.contentUri
        ? { ...meta, grepCodes: newGrepCodes }
        : meta,
    );
    qc.setQueryData(compKey, newMetas);
    qc.cancelQueries(compKey);
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
    <Wrapper>
      <StyledDndIconWrapper
        isVisible={resource.contentMeta?.articleType !== 'topic-article'}
        {...dragHandleProps}>
        <StyledDndIcon />
      </StyledDndIconWrapper>

      <StyledCard>
        <BadgeWrapper>
          {contentType && (
            <StyledResourceIcon key="img">
              <ContentTypeBadge background type={iconType} size="x-small" />
            </StyledResourceIcon>
          )}
        </BadgeWrapper>
        <ContentWrapper>
          <StyledText data-testid={`resource-type-${contentType}`}>
            <StyledResourceBody key="body">
              <ResourceItemLink
                contentType={contentType}
                contentUri={resource.contentUri}
                name={resource.name}
                isVisible={resource.metadata?.visible}
                size="small"
              />
            </StyledResourceBody>
            <WrongTypeError resource={resource} articleType={resource.contentMeta?.articleType} />
            {(resource.contentMeta?.status?.current === PUBLISHED ||
              resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
              <PublishedWrapper path={path}>
                <Tooltip tooltip={t('form.workflow.published')}>
                  <StyledCheckIcon />
                </Tooltip>
              </PublishedWrapper>
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
          <ButtonRow>
            <ButtonV2 css={{ flex: 2 }} size="xsmall" colorTheme="lighter">
              Ansvarlig: Navn Navnesen
            </ButtonV2>
            {contentType !== 'learning-path' && (
              <ButtonWithSpacing
                size="xsmall"
                colorTheme="lighter"
                onClick={() => setShowGrepCodes(true)}>
                {`GREP (${resource.contentMeta?.grepCodes?.length || 0})`}
              </ButtonWithSpacing>
            )}
            {resource.contentMeta?.status?.current && (
              <ButtonWithSpacing
                size="xsmall"
                colorTheme="lighter"
                onClick={() => setShowVersionHistory(true)}
                disabled={contentType === 'learning-path'}>
                {t(`form.status.${resource.contentMeta.status.current.toLowerCase()}`)}
              </ButtonWithSpacing>
            )}
          </ButtonRow>
        </ContentWrapper>
      </StyledCard>
    </Wrapper>
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
