import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatus } from '../../../modules/draft/draftApiInterfaces';

interface Props {
  topicDescription?: string;
  locale: string;
  refreshTopics: () => Promise<void>;
  currentTopic: SubjectTopic;
  status?: DraftStatus;
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

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleDisplayTopicDescription = () => {
    setDisplayTopicDescription(!displayTopicDescription);
  };

  return (
    <div ref={resourceRef}>
      <Accordion
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('searchForm.articleType.topicArticle')}
        hidden={!displayTopicDescription}
        handleToggle={toggleDisplayTopicDescription}>
        {topicDescription && (
          <Resource
            resource={{
              ...currentTopic,
              name: topicDescription,
              status,
              topicId: currentTopic.id,
              paths: [],
              resourceTypes: [],
            }}
            locale={locale}
            connectionId={currentTopic.connectionId}
            relevanceId={currentTopic.relevanceId}
            primary={currentTopic.isPrimary}
            rank={currentTopic.rank}
          />
        )}
      </Accordion>
      {showAddModal && (
        <AddArticleModal
          toggleAddModal={toggleAddModal}
          locale={locale}
          refreshTopics={refreshTopics}
          currentTopic={currentTopic}
        />
      )}
    </div>
  );
};

export default injectT(TopicDescription);
