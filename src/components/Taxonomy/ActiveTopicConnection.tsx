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

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  topic: StagedTopic;
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
  topic,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const breadcrumb = useSearchNodes({
    ids: topic.path
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
        <Breadcrumb breadcrumb={[topic]} />
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection && removeConnection(topic.id)}
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
            primary={primaryPath === topic.path}
            type="button"
            onClick={() => setPrimaryConnection?.(topic.path)}
          >
            {t('form.topics.primaryTopic')}
          </StyledPrimaryConnectionButton>
          <Breadcrumb breadcrumb={breadcrumb.data.results} />
        </StyledFlexWrapper>
        <StyledFlexWrapper>
          <RelevanceOption
            relevanceId={topic.relevanceId}
            onChange={(relevanceId) => setRelevance && setRelevance(topic.id, relevanceId)}
          />
          <RemoveButton onClick={() => removeConnection && removeConnection(topic.id)} />
        </StyledFlexWrapper>
      </StyledConnections>
    </>
  );
};

export default ActiveTopicConnection;
