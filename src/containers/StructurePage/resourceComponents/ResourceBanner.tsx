/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing, fonts } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { Dictionary } from '../../../interfaces';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import { ResourceGroupBanner, StyledIcon } from '../styles';
import ApproachingRevisionDate from './ApproachingRevisionDate';
import GroupTopicResources from '../folderComponents/topicMenuOptions/GroupTopicResources';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';

const PublishedText = styled.div`
  font-weight: ${fonts.weight.normal};
  text-align: center;
`;

const RightContent = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
  justify-content: space-between;
`;

const BannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
`;

const ControlWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const getPublishedCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const publishedCount = contentMetaList.filter(c => c.status?.current === 'PUBLISHED').length;
  return publishedCount;
};

interface Props {
  title: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ChildNodeType;
  onCurrentNodeChanged: (changedNode: ChildNodeType) => void;
  addButton?: ReactNode;
  articleIds?: number[];
}

const ResourceBanner = ({
  title,
  contentMeta,
  currentNode,
  onCurrentNodeChanged,
  addButton,
  articleIds,
}: Props) => {
  const elementCount = Object.values(contentMeta).length;
  const publishedCount = getPublishedCount(contentMeta);
  const { t } = useTranslation();

  return (
    <ResourceGroupBanner>
      <BannerWrapper>
        <div>
          <RightContent>
            <ButtonV2
              size="small"
              variant="outline"
              onClick={() =>
                document.getElementById(currentNode.id)?.scrollIntoView({ block: 'center' })
              }>
              {t('taxonomy.jumpToStructure')}
            </ButtonV2>
            <ControlWrapper>
              <PublishedText>{`${publishedCount}/${elementCount} publisert`}</PublishedText>
              <ApproachingRevisionDate articleIds={articleIds} />
              {currentNode && currentNode.id && (
                <GroupTopicResources
                  node={currentNode}
                  hideIcon
                  onChanged={partialMeta => {
                    onCurrentNodeChanged({
                      ...currentNode,
                      metadata: { ...currentNode.metadata, ...partialMeta },
                    });
                  }}
                />
              )}
            </ControlWrapper>
          </RightContent>
        </div>
        <div>
          <StyledIcon />
          {title}
          {addButton}
        </div>
      </BannerWrapper>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
