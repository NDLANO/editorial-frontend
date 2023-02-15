/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { TFunction } from 'i18next';
import keyBy from 'lodash/keyBy';
import { ChildNodeType, ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import {
  NodeResourceMeta,
  useNodeResourceMetas,
  useResourcesWithNodeConnection,
} from '../../../modules/nodes/nodeQueries';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import handleError from '../../../util/handleError';
import ResourcesContainer from './ResourcesContainer';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

const StickyContainer = styled.div`
  position: sticky;
  top: ${spacing.small};
`;

export interface ResourceWithNodeConnectionAndMeta extends ResourceWithNodeConnection {
  contentMeta?: NodeResourceMeta;
}

interface Props {
  currentChildNode: ChildNodeType;
  resourceRef: RefObject<HTMLDivElement>;
  setCurrentNode: (changedNode: ChildNodeType) => void;
}

const getMissingResourceType = (t: TFunction): ResourceType & { disabled?: boolean } => ({
  id: 'missing',
  name: t('taxonomy.missingResourceType'),
  disabled: true,
});

const missingObject = {
  id: 'missing',
  name: '',
  connectionId: '',
  supportedLanguages: [],
  translations: [],
};
const withMissing = (r: ResourceWithNodeConnection): ResourceWithNodeConnection => ({
  ...r,
  resourceTypes: [missingObject],
});

const StructureResources = ({ currentChildNode, resourceRef, setCurrentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const grouped = currentChildNode?.metadata?.customFields['topic-resources'] ?? 'grouped';

  const { data: nodeResources } = useResourcesWithNodeConnection(
    { id: currentChildNode.id, language: i18n.language, taxonomyVersion },
    {
      select: resources => resources.map(r => (r.resourceTypes.length > 0 ? r : withMissing(r))),
      onError: e => handleError(e),
      placeholderData: [],
    },
  );

  const { data: nodeResourceMetas, isLoading: contentMetaLoading } = useNodeResourceMetas(
    {
      nodeId: currentChildNode.id,
      ids:
        nodeResources
          ?.map(r => r.contentUri)
          .concat(currentChildNode.contentUri)
          .filter<string>((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    },
    { enabled: !!nodeResources?.length },
  );

  const keyedMetas = keyBy(nodeResourceMetas, m => m.contentUri);

  const { data: resourceTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: resourceTypes => resourceTypes.concat(getMissingResourceType(t)),
      onError: e => handleError(e),
    },
  );

  return (
    <StickyContainer ref={resourceRef}>
      <ResourcesContainer
        key="ungrouped"
        nodeResources={nodeResources ?? []}
        resourceTypes={resourceTypes ?? []}
        currentNode={currentChildNode}
        contentMeta={keyedMetas}
        grouped={grouped === 'grouped'}
        setCurrentNode={setCurrentNode}
        contentMetaLoading={contentMetaLoading}
      />
    </StickyContainer>
  );
};

export default memo(StructureResources);
