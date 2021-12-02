/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '../../../components/Accordion';
import Resource from './Resource';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ChildNodeType } from '../../../modules/taxonomy/nodes/nodeApiTypes';

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
            resource={{
              ...currentNode,
              paths: [],
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
