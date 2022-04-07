/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
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
import { EditMode } from '../../../../interfaces';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  path: string;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
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
  onClose,
  editMode,
  structure,
  numberOfSubtopics = 0,
  refreshTopics,
  id,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [topics, setTopics] = useState<(Topic & { description?: string })[]>([]);

  useEffect(() => {
    (async () => {
      const topics = await fetchTopics({ language: locale || 'nb', taxonomyVersion });
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

  const onAddExistingSubTopic = async (topic: { id: string }) => {
    const connections = await fetchTopicConnections({ id: topic.id, taxonomyVersion });

    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection({ id: connectionId, taxonomyVersion });
      } else {
        await deleteTopicConnection({ id: connectionId, taxonomyVersion });
      }
    }

    await addTopicToTopic({
      body: {
        subtopicid: topic.id,
        topicid: id,
        primary: false,
        rank: numberOfSubtopics + 1,
      },
      taxonomyVersion,
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
