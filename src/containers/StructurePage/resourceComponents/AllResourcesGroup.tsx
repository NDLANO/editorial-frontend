/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddTopicResourceButton from './AddTopicResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';

import { Filter, Resource } from '../../../interfaces';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  topicResources: {
    resources: Resource[];
    contentType: string;
  }[];
  resourceTypes: {
    id: string;
    name: string;
    subtypes: [];
    disabled: boolean;
  }[];
  params: {
    topic: string;
    subtopics: string;
  };
  refreshResources: () => void;
  availableFilters: Filter[];
  activeFilter: string;
  locale: string;
  currentTopic: {
    filters: Filter[];
  };
  currentSubject: {
    id: string;
    name: string;
  };
  structure: {}[];
}

const AllResourcesGroup = ({
  resourceTypes,
  topicResources,
  params,
  refreshResources,
  locale,
  currentTopic,
  currentSubject,
  structure,
  t,
}: Props & tType) => {
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const toggleDisplayResource = () => {
    setDisplayResource(prev => !prev);
  };

  const toggleAddModal = () => {
    setShowAddModal(prev => !prev);
  };

  const topicId = params.subtopics?.split('/')?.pop() || params.topic;

  const newResourceTypeOptions = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  return (
    <React.Fragment>
      <Accordion
        addButton={
          <AddTopicResourceButton stripped onClick={toggleAddModal}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddTopicResourceButton>
        }
        handleToggle={toggleDisplayResource}
        appearance="resourceGroup"
        header={t('taxonomy.resources')}
        hidden={!displayResource}>
        <ResourceItems
          resources={topicResources}
          refreshResources={refreshResources}
          locale={locale}
          currentTopic={currentTopic}
          currentSubject={currentSubject}
          structure={structure}
        />
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          resourceTypes={newResourceTypeOptions}
          topicId={topicId}
          refreshResources={refreshResources}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </React.Fragment>
  );
};

export default injectT(AllResourcesGroup);
