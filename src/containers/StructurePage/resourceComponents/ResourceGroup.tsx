/**
 * Copyright (c) 2017-present, NDLA.
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
import { SubjectType } from '../../../interfaces';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  topicResource: any;
  resource: any;
  params: any;
  locale: string;
  refreshResources: () => Promise<void>;
  currentSubject: SubjectType;
}

const ResourceGroup = ({
  resource,
  topicResource,
  t,
  params,
  refreshResources,
  locale,
  currentSubject,
}: Props & tType) => {
  const [displayResource, setDisplayResource] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggle = () => setDisplayResource(!displayResource);

  const toggleAddModal = () => setShowAddModal(!showAddModal);

  const topicId = params.subtopics?.split('/')?.pop() || params.topic;

  return (
    <>
      <Accordion
        addButton={
          <AddTopicResourceButton stripped onClick={toggleAddModal} disabled={resource.disabled}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddTopicResourceButton>
        }
        handleToggle={handleToggle}
        appearance="resourceGroup"
        header={resource.name}
        hidden={topicResource.resources ? displayResource : true}>
        {topicResource.resources && (
          <ResourceItems
            resources={topicResource.resources}
            contentType={topicResource.contentType}
            refreshResources={refreshResources}
            locale={locale}
            currentSubject={currentSubject}
          />
        )}
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          type={resource.id}
          allowPaste={resource.id !== RESOURCE_TYPE_LEARNING_PATH}
          topicId={topicId}
          refreshResources={refreshResources}
          onClose={toggleAddModal}
        />
      )}
    </>
  );
};

export default injectT(ResourceGroup);
