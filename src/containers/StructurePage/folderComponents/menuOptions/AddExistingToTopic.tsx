/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Plus } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import {
  addTopicToTopic,
  fetchTopicConnections,
  deleteSubTopicConnection,
  deleteTopicConnection,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemDropdown from './MenuItemDropdown';
import retrieveBreadCrumbs, { PathArray } from '../../../../util/retrieveBreadCrumbs';
import { Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { EditMode } from '../../../../interfaces';
import { useTopics } from '../../../../modules/taxonomy/topics/topicQueries';
import { SUBJECT_TOPICS } from '../../../../queryKeys';

interface Props {
  subjectId: string;
  path: string;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  locale: string;
  id: string;
  numberOfSubtopics?: number;
  structure: PathArray;
}

const AddExistingToTopic = ({
  subjectId,
  locale,
  path,
  toggleEditMode,
  onClose,
  editMode,
  structure,
  numberOfSubtopics = 0,
  id,
}: Props) => {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const getTopicBreadcrumb = (topic: Topic, topics: Topic[]) => {
    if (!topic.path) return undefined;
    const bc = retrieveBreadCrumbs({
      topicPath: topic.path,
      structure: structure,
      allTopics: topics,
      title: topic.name,
    });
    return bc.map(crumb => crumb.name).join(' > ');
  };

  const { data: topics } = useTopics(locale ?? 'nb', {
    select: topics =>
      topics
        .filter(t => t.path)
        .filter(t => !t.paths?.find(p => path.includes(p)))
        .map(topic => ({ ...topic, description: getTopicBreadcrumb(topic, topics) })),
  });

  const onAddExistingSubTopic = async (topic: { id: string }) => {
    const connections = await fetchTopicConnections(topic.id);

    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
    }

    await addTopicToTopic({
      subtopicid: topic.id,
      topicid: id,
      primary: false,
      rank: numberOfSubtopics + 1,
    });
    qc.invalidateQueries([SUBJECT_TOPICS, subjectId]);
  };

  const toggleEditModeFunc = () => {
    toggleEditMode('addExistingTopic');
  };

  return editMode === 'addExistingTopic' ? (
    <MenuItemDropdown
      placeholder={t('taxonomy.existingTopic')}
      searchResult={topics ?? []}
      onClose={onClose}
      onSubmit={onAddExistingSubTopic}
      icon={<Plus />}
      showPagination
    />
  ) : (
    <MenuItemButton stripped onClick={toggleEditModeFunc}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addExistingTopic')}
    </MenuItemButton>
  );
};

export default memo(AddExistingToTopic);
