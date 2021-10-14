/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddTopicResourceButton from './AddTopicResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { TopicResource } from './StructureResources';
import { LocaleType } from '../../../interfaces';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  currentTopicId: string;
  topicResources: TopicResource[];
  resourceTypes: (ResourceType & {
    disabled?: boolean;
  })[];
  locale: LocaleType;
}

const AllResourcesGroup = ({ resourceTypes, topicResources, locale, currentTopicId }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const toggleDisplayResource = () => {
    setDisplayResource(prev => !prev);
  };

  const toggleAddModal = () => {
    setShowAddModal(prev => !prev);
  };

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
        <ResourceItems resources={topicResources} locale={locale} currentTopicId={currentTopicId} />
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          resourceTypes={newResourceTypeOptions}
          topicId={currentTopicId}
          refreshResources={() => {}}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={topicResources.map(r => r.id)}
          locale={locale}
        />
      )}
    </>
  );
};

export default AllResourcesGroup;
