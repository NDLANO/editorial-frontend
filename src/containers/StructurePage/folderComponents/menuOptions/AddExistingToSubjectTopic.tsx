/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Plus } from '@ndla/icons/action';
import { injectT, tType } from '@ndla/i18n';
import { useState } from 'react';
import { useEffect } from 'react';
import RoundIcon from '../../../../components/RoundIcon';
import {
  addSubjectTopic,
  fetchTopics,
  fetchTopicConnections,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../../modules/taxonomy';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import retrieveBreadCrumbs, { PathArray } from '../../../../util/retrieveBreadCrumbs';
import { Topic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  path: string;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: string) => void;
  locale: string;
  id: string;
  refreshTopics: () => Promise<void>;
  structure: PathArray;
}

const AddExistingToSubjectTopic = ({
  locale,
  structure,
  id,
  refreshTopics,
  toggleEditMode,
  onClose,
  t,
  editMode,
}: Props & tType) => {
  const [topics, setTopics] = useState<(Topic & { description?: string })[]>([]);

  useEffect(() => {
    (async () => {
      const localTopics = await fetchTopics(locale || 'nb');
      setTopics(
        localTopics
          .filter(t => t.path)
          .map(t => ({ ...t, description: getTopicBreadcrumb(t, localTopics) })),
      );
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    await Promise.all([
      addSubjectTopic({
        subjectid: id,
        topicid: topic.id,
      }),
    ]);
    refreshTopics();
  };

  const toggleEditModeFunc = () => {
    toggleEditMode('addExistingSubjectTopic');
  };

  if (editMode === 'addExistingSubjectTopic') {
    return (
      <MenuItemDropdown
        searchResult={topics}
        placeholder={t('taxonomy.existingTopic')}
        onClose={onClose}
        onSubmit={onAddExistingTopic}
        icon={<Plus />}
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

export default injectT(AddExistingToSubjectTopic);
