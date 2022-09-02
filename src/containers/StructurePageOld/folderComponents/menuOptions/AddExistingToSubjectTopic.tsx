/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
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
import { EditMode } from '../../../../interfaces';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  path: string;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
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
  editMode,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [topics, setTopics] = useState<(Topic & { description?: string })[]>([]);

  useEffect(() => {
    (async () => {
      const localTopics = await fetchTopics({ language: locale || 'nb', taxonomyVersion });
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
    const connections = await fetchTopicConnections({ id: topic.id, taxonomyVersion });

    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection({ id: connectionId, taxonomyVersion });
      } else {
        await deleteTopicConnection({ id: connectionId, taxonomyVersion });
      }
    }

    await Promise.all([
      addSubjectTopic({
        body: {
          subjectid: id,
          topicid: topic.id,
        },
        taxonomyVersion,
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
