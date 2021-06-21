import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import { ResourceWithTopicConnection, Status } from '../../../interfaces';

interface Props {
  topicDescription?: string;
  locale: string;
  refreshTopics: () => Promise<void>;
  currentTopic: ResourceWithTopicConnection;
  status?: Status;
  resourceRef: React.RefObject<any>;
}

const TopicDescription = ({
  topicDescription,
  locale,
  refreshTopics,
  currentTopic,
  status,
  resourceRef,
  t,
}: Props & tType) => {
  const [displayTopicDescription, setDisplayTopicDescription] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div ref={resourceRef}>
      <Accordion
        appearance="resourceGroup"
        header={t('searchForm.articleType.topicArticle')}
        hidden={!displayTopicDescription}
        handleToggle={() => setDisplayTopicDescription(displayTopicDescription)}>
        {topicDescription && (
          <Resource
            contentType="topic-article"
            name={topicDescription}
            locale={locale}
            contentUri={currentTopic.contentUri!!}
            status={status}
            metadata={currentTopic.metadata}
            connectionId={currentTopic.connectionId}
            relevanceId={currentTopic.relevanceId}
            refreshResources={refreshTopics}
            primary={currentTopic.isPrimary}
            rank={currentTopic.rank}
          />
        )}
      </Accordion>
      {showAddModal && (
        <AddArticleModal
          toggleAddModal={() => setShowAddModal(showAddModal)}
          locale={locale}
          refreshTopics={refreshTopics}
          currentTopic={currentTopic}
        />
      )}
    </div>
  );
};

export default injectT(TopicDescription);
