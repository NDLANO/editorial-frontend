/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useState } from 'react';
import { Plus } from '@ndla/icons/action';
import { injectT, tType } from '@ndla/i18n';
import { useEffect } from 'react';
import RoundIcon from '../../../../components/RoundIcon';
import {
  fetchTopics,
  addTopicToTopic,
  fetchTopicConnections,
  deleteSubTopicConnection,
  deleteTopicConnection,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemDropdown from './MenuItemDropdown';
import retrieveBreadCrumbs, { PathArray } from '../../../../util/retrieveBreadCrumbs';
import { Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  path: string;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: string) => void;
  locale: string;
  id: string;
  numberOfSubtopics?: number;
  structure: PathArray;
  refreshTopics: () => Promise<void>;
}

const AddExistingToTopic = ({
  locale,
  path,
  toggleEditMode,
  t,
  onClose,
  editMode,
  structure,
  numberOfSubtopics = 0,
  refreshTopics,
  id,
}: Props & tType) => {
  const [topics, setTopics] = useState<(Topic & { description?: string })[]>([]);

  useEffect(() => {
    (async () => {
      const topics = await fetchTopics(locale || 'nb');
      const alteredTopics = topics
        .filter(topic => topic.path)
        .filter(topic => !topic.paths?.find(p => path.includes(p)))
        .map(topic => ({
          ...topic,
          description: getTopicBreadcrumb(topic, topics),
        }));
      setTopics(alteredTopics);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getTopicBreadcrumb = (topic: any, topics: any[]) => {
    if (!topic.path) return undefined;
    const bc = retrieveBreadCrumbs({
      topicPath: topic.path,
      structure: structure,
      allTopics: topics,
      title: topic.name,
    });
    return bc.map(crumb => crumb.name).join(' > ');
  };

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
    refreshTopics();
  };

  const toggleEditModeFunc = () => {
    toggleEditMode('addExistingTopic');
  };

  return editMode === 'addExistingTopic' ? (
    <MenuItemDropdown
      placeholder={t('taxonomy.existingTopic')}
      searchResult={topics}
      onClose={onClose}
      onSubmit={onAddExistingSubTopic}
      icon={<Plus />}
    />
  ) : (
    <MenuItemButton stripped onClick={toggleEditModeFunc}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addExistingTopic')}
    </MenuItemButton>
  );
};

export default memo(injectT(AddExistingToTopic));
