import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
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
  topicArticleType?: string;
}

const TopicDescription = ({ locale, currentTopic, grepCodes, onUpdateResource }: Props) => {
  const { t } = useTranslation();
  const [displayTopicDescription, setDisplayTopicDescription] = useState(true);

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
    </>
  );
};

export default TopicDescription;
