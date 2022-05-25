/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import AddTopicResourceButton from './AddTopicResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { TopicResource } from './StructureResources';
import { LocaleType } from '../../../interfaces';

interface Props {
  topicResources: TopicResource[];
  resourceTypes: (ResourceType & {
    disabled?: boolean;
  })[];
  params: { topic: string; subtopics?: string };
  onDeleteResource: (resourceId: string) => void;
  refreshResources: () => Promise<void>;
  locale: LocaleType;
  onUpdateResource: (resource: TopicResource) => void;
}

const AllResourcesGroup = ({
  resourceTypes,
  topicResources,
  params,
  refreshResources,
  locale,
  onDeleteResource,
  onUpdateResource,
}: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const toggleDisplayResource = () => {
    setDisplayResource(prev => !prev);
  };

  const toggleAddModal = () => {
    setShowAddModal(prev => !prev);
  };

  const topicId = (params.subtopics?.split('/')?.pop() || params.topic)!;

  const newResourceTypeOptions = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  return (
    <>
      <Accordion
        addButton={
          <AddTopicResourceButton stripped onClick={toggleAddModal}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddTopicResourceButton>
        }
        handleToggle={toggleDisplayResource}
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('taxonomy.resources')}
        hidden={!displayResource}>
        <ResourceItems
          onDeleteResource={onDeleteResource}
          onUpdateResource={onUpdateResource}
          resources={topicResources}
          refreshResources={refreshResources}
          locale={locale}
        />
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          resourceTypes={newResourceTypeOptions}
          topicId={topicId}
          refreshResources={refreshResources}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={topicResources.map(r => r.id)}
          locale={locale}
        />
      )}
    </>
  );
};

export default AllResourcesGroup;
