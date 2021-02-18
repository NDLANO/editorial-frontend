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
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';

import { Filter } from '../../../interfaces';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  topicResources: {
    resources: [];
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
  availableFilters: Filter;
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

const ResourceGroup = ({
  resourceTypes,
  topicResources,
  t,
  params,
  refreshResources,
  availableFilters,
  activeFilter,
  locale,
  currentTopic,
  currentSubject,
  structure,
}: Props & tType) => {
  const [displayResource, setDisplayResource] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleToggle = () => {
    setDisplayResource(prev => !prev);
  };

  const toggleAddModal = () => {
    setShowAddModal(prev => !prev);
  };

  const topicId = params.subtopics?.split('/')?.pop() || params.topic;
  console.log('resources', topicResources, currentTopic);

  return (
    <React.Fragment>
      <Accordion
        addButton={
          <AddTopicResourceButton stripped onClick={toggleAddModal}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddTopicResourceButton>
        }
        handleToggle={handleToggle}
        appearance="resourceGroup"
        header="Resurser"
        hidden={!displayResource}>
        <ResourceItems
          resources={topicResources}
          contentType="all"
          refreshResources={refreshResources}
          availableFilters={availableFilters}
          activeFilter={activeFilter}
          locale={locale}
          currentTopic={currentTopic}
          currentSubject={currentSubject}
          structure={structure}
        />
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          topicFilters={currentTopic.filters}
          type={resourceTypes[0].id}
          allowPaste={resourceTypes[0].id !== RESOURCE_TYPE_LEARNING_PATH}
          topicId={topicId}
          refreshResources={refreshResources}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </React.Fragment>
  );
};

export default injectT(ResourceGroup);
