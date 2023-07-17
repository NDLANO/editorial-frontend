/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cross } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { NodeChild } from '@ndla/types-taxonomy';
import {
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../style/LearningResourceTaxonomyStyles';
import Breadcrumb from './Breadcrumb';
import RelevanceOption from './RelevanceOption';
import RemoveButton from './RemoveButton';
import { StagedTopic } from '../../containers/ArticlePage/TopicArticlePage/components/TopicArticleTaxonomy';
import { useSearchNodes } from '../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (connectionId: string) => void;
  node: MinimalNodeChild;
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
  primaryPath: string | undefined;
}

const StyledFlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveTopicConnection = ({
  removeConnection,
  setPrimaryConnection,
  setRelevance,
  type,
  primaryPath,
  node,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const breadcrumb = useSearchNodes({
    ids: node.path
      .split('/')
      .filter((id) => id && !id.includes('resource:'))
      .map((id) => `urn:${id}`),
    taxonomyVersion,
  });
  if (!breadcrumb.data) {
    return null;
  }
  if (!breadcrumb.data?.results) {
    return (
      <StyledConnections error>
        <StyledErrorLabel>{t('taxonomy.topics.disconnectedTaxonomyWarning')}</StyledErrorLabel>
        <Breadcrumb breadcrumb={[node]} />
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection && removeConnection(node.id)}
        >
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
    );
  }

  if (type === 'topic-article') {
    return (
      <>
        <StyledConnections>
          <Breadcrumb breadcrumb={breadcrumb.data.results} type={type} />
        </StyledConnections>
      </>
    );
  }
  return (
    <>
      <StyledConnections>
        <StyledFlexWrapper>
          <StyledPrimaryConnectionButton
            primary={primaryPath === node.path}
            type="button"
            onClick={() => setPrimaryConnection?.(node.id)}
          >
            {t('form.topics.primaryTopic')}
          </StyledPrimaryConnectionButton>
          <Breadcrumb breadcrumb={breadcrumb.data.results} />
        </StyledFlexWrapper>
        <StyledFlexWrapper>
          <RelevanceOption
            relevanceId={node.relevanceId}
            onChange={(relevanceId) => setRelevance && setRelevance(node.id, relevanceId)}
          />
          <RemoveButton onClick={() => removeConnection && removeConnection(node.id)} />
        </StyledFlexWrapper>
      </StyledConnections>
    </>
  );
};

export default ActiveTopicConnection;
