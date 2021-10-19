/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Plus } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import {
  addSubjectTopic,
  fetchTopicConnections,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../../modules/taxonomy';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import retrieveBreadCrumbs, { PathArray } from '../../../../util/retrieveBreadCrumbs';
import { Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { EditMode } from '../../../../interfaces';
import { SUBJECT_TOPICS_WITH_ARTICLE_TYPE } from '../../../../queryKeys';
import { useTopics } from '../../../../modules/taxonomy/topics/topicQueries';

interface Props {
  path: string;
  onClose: () => void;
  editMode: EditMode;
  toggleEditMode: (mode: EditMode) => void;
  locale: string;
  id: string;
  structure: PathArray;
}

const AddExistingToSubjectTopic = ({
  locale,
  structure,
  id,
  toggleEditMode,
  onClose,
  editMode,
  path,
}: Props) => {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const getTopicBreadcrumb = (topic: Topic, localTopics: Topic[]) => {
    if (!topic.path) return undefined;
    const bc = retrieveBreadCrumbs({
      topicPath: topic.path,
      structure: structure,
      allTopics: localTopics,
      title: topic.name,
    });
    return bc.map(crumb => crumb.name).join(' > ');
  };

  const { data: topics } = useTopics(locale ?? 'nb', {
    enabled: editMode === 'addExistingSubjectTopic',
    select: topics =>
      topics
        .filter(t => !!t.path)
        .filter(t => !t.paths.find(p => p.includes(path)))
        .map(t => ({ ...t, description: getTopicBreadcrumb(t, topics) })),
  });

  const onAddExistingTopic = async (topic: { id: string }) => {
    const connections = await fetchTopicConnections(topic.id);

    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
    }

    await addSubjectTopic({ subjectid: id, topicid: topic.id });
    qc.invalidateQueries([SUBJECT_TOPICS_WITH_ARTICLE_TYPE, id]);
  };

  const toggleEditModeFunc = () => {
    toggleEditMode('addExistingSubjectTopic');
  };

  if (editMode === 'addExistingSubjectTopic') {
    return (
      <MenuItemDropdown
        searchResult={topics ?? []}
        placeholder={t('taxonomy.existingTopic')}
        onClose={onClose}
        onSubmit={onAddExistingTopic}
        icon={<Plus />}
        showPagination
      />
    );
  }
  return (
    <MenuItemButton
      stripped
      data-testid="addExistingSubjectTopicButton"
      onClick={toggleEditModeFunc}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addExistingTopic')}
    </MenuItemButton>
  );
};

export default AddExistingToSubjectTopic;
