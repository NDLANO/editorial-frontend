import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import AddArticleModal from './AddArticleModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { SubjectTopic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { updateRelevanceId } from '../../../util/taxonomyHelpers';
import { LocaleType } from '../../../interfaces';
import { TopicResource } from './StructureResources';

interface Props {
  locale: LocaleType;
  currentTopic: SubjectTopic;
  grepCodes: string[];
  onUpdateResource: (updatedResource: TopicResource) => void;
}

const TopicDescription = ({ locale, currentTopic, grepCodes, onUpdateResource }: Props) => {
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
    <>
      <Accordion
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('searchForm.articleType.topicArticle')}
        hidden={!displayTopicDescription}
        handleToggle={toggleDisplayTopicDescription}>
        <>
          {currentTopic.name && (
            <Resource
              updateResource={onUpdateResource}
              resource={{
                ...currentTopic,
                topicId: currentTopic.id,
                paths: [],
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
          refreshTopics={async () => {}}
          currentTopic={currentTopic}
        />
      )}
    </>
  );
};

export default TopicDescription;
