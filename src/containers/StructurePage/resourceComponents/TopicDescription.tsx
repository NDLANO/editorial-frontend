import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatus } from '../../../modules/draft/draftApiInterfaces';
import { updateRelevanceId } from '../../../util/taxonomyHelpers';
import { LocaleType } from '../../../interfaces';

interface Props {
  topicDescription?: string;
  locale: LocaleType;
  refreshTopics: () => Promise<void>;
  currentTopic: SubjectTopic;
  status?: DraftStatus;
  resourceRef: React.RefObject<HTMLDivElement>;
  grepCodes: string[];
}

const TopicDescription = ({
  topicDescription,
  locale,
  refreshTopics,
  currentTopic,
  status,
  resourceRef,
  grepCodes,
}: Props) => {
  const { t } = useTranslation();
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
        <>
          {topicDescription && (
            <Resource
              resource={{
                ...currentTopic,
                name: topicDescription,
                status,
                topicId: currentTopic.id,
                paths: [],
                resourceTypes: [],
                grepCodes,
              }}
              locale={locale}
              updateRelevanceId={updateRelevanceId}
              connectionId={currentTopic.connectionId}
              relevanceId={currentTopic.relevanceId}
              primary={currentTopic.isPrimary}
              rank={currentTopic.rank}
            />
          )}
        </>
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

export default TopicDescription;
