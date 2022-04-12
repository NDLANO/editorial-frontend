/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../../../components/Accordion';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';
import Resource from './Resource';

interface Props {
  currentNode: ChildNodeType;
}

const NodeDescription = ({ currentNode }: Props) => {
  const { t } = useTranslation();
  const [displayDescription, setDisplayDescription] = useState(true);

  const toggleDisplayDescription = () => {
    setDisplayDescription(!displayDescription);
  };

  return (
    <>
      <Accordion
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('searchForm.articleType.topicArticle')}
        hidden={!displayDescription}
        handleToggle={toggleDisplayDescription}>
        {currentNode.name && (
          <Resource
            currentNodeId={currentNode.id}
            resource={{
              ...currentNode,
              paths: currentNode.paths ?? [],
              nodeId: '',
              resourceTypes: [],
              relevanceId: currentNode.relevanceId!,
            }}
          />
        )}
      </Accordion>
    </>
  );
};

export default NodeDescription;
