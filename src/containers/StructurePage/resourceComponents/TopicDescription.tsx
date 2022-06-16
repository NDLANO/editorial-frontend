import { RefObject, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { IStatus } from '@ndla/types-draft-api';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { updateRelevanceId } from '../../../util/taxonomyHelpers';
import { LocaleType } from '../../../interfaces';
import { TopicResource } from './StructureResources';

interface Props {
  topicDescription?: string;
  locale: LocaleType;
  refreshTopics: () => Promise<void>;
  currentTopic: SubjectTopic;
  status?: IStatus;
  resourceRef: RefObject<HTMLDivElement>;
  grepCodes: string[];
  onUpdateResource: (updatedResource: TopicResource) => void;
  topicArticleType?: string;
}

const TopicDescription = ({
  topicDescription,
  locale,
  refreshTopics,
  currentTopic,
  status,
  resourceRef,
  grepCodes,
  onUpdateResource,
  topicArticleType,
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
        appearance={'resourceGroup'}
        header={t('searchForm.articleType.topicArticle')}
        hidden={!displayTopicDescription}
        handleToggle={toggleDisplayTopicDescription}>
        <>
          {topicDescription && (
            <Resource
              updateResource={onUpdateResource}
              resource={{
                ...currentTopic,
                articleType: topicArticleType,
                name: topicDescription,
                status,
                topicId: currentTopic.id,
                resourceTypes: [],
                grepCodes,
                primary: currentTopic.isPrimary,
                relevanceId: currentTopic.relevanceId!,
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
