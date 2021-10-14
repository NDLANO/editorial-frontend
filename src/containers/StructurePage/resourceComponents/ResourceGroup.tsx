/**
 * Copyright (c) 2017-present, NDLA.
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

import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { TopicResource } from './StructureResources';
import { LocaleType } from '../../../interfaces';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  topicResource?: {
    resources?: TopicResource[];
    contentType: string;
  };
  resourceType: ResourceType & {
    disabled?: boolean;
  };
  locale: LocaleType;
  currentTopicId: string;
}
const ResourceGroup = ({ resourceType, topicResource, locale, currentTopicId }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggle = () => {
    setDisplayResource(!displayResource);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <>
      <Accordion
        addButton={
          <AddTopicResourceButton
            stripped
            onClick={toggleAddModal}
            disabled={resourceType.disabled}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddTopicResourceButton>
        }
        handleToggle={handleToggle}
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={resourceType.name}
        hidden={topicResource?.resources ? displayResource : true}>
        <>
          {topicResource?.resources && (
            <ResourceItems
              resources={topicResource.resources}
              locale={locale}
              currentTopicId={currentTopicId}
            />
          )}
        </>
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          type={resourceType.id}
          allowPaste={resourceType.id !== RESOURCE_TYPE_LEARNING_PATH}
          topicId={currentTopicId}
          refreshResources={async () => {}}
          onClose={toggleAddModal}
          existingResourceIds={topicResource?.resources?.map(r => r.id) ?? []}
          locale={locale}
        />
      )}
    </>
  );
};

export default ResourceGroup;
