/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { RefObject } from 'react';
import { TFunction } from 'i18next';
import { groupBy, merge, uniqBy } from 'lodash';
import { ChildNodeType, ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { useResourcesWithNodeConnection } from '../../../modules/nodes/nodeQueries';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import NodeDescription from './NodeDescription';
import handleError from '../../../util/handleError';
import AllResourcesGroup from './AllResourcesGroup';
import ResourceGroup from './ResourceGroup';
import { groupSortResourceTypesFromNodeResources } from '../../../util/taxonomyHelpers';
import GroupTopicResources from '../folderComponents/topicMenuOptions/GroupTopicResources';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.xsmall};
`;

interface Props {
  currentChildNode: ChildNodeType;
  resourceRef: RefObject<HTMLDivElement>;
  onCurrentNodeChanged: (changedNode: ChildNodeType) => void;
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

const StructureResources = ({ currentChildNode, resourceRef, onCurrentNodeChanged }: Props) => {
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

  const { data: resourceTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: resourceTypes => resourceTypes.concat(getMissingResourceType(t)),
      onError: e => handleError(e),
    },
  );

  const groupedNodeResources = groupSortResourceTypesFromNodeResources(
    resourceTypes ?? [],
    nodeResources ?? [],
  );

  const resourceToTypeMapping = (
    resources: ResourceWithNodeConnection[],
    resourceTypes: ResourceType[],
  ) => {
    const types = resourceTypes.reduce<Record<string, string>>((types, rt) => {
      const reversedMapping =
        rt.subtypes?.reduce<Record<string, string>>((acc, curr) => {
          acc[curr.id] = rt.id;
          return acc;
        }, {}) ?? {};
      reversedMapping[rt.id] = rt.id;
      return merge(types, reversedMapping);
    }, {});

    const typeToResourcesMapping = resources
      .flatMap(res =>
        res.resourceTypes.map<[string, ResourceWithNodeConnection]>(rt => [rt.id, res]),
      )
      .reduce<Record<string, { parent: string; resources: ResourceWithNodeConnection[] }>>(
        (acc, [id, curr]) => {
          if (acc[id]) {
            acc[id]['resources'] = acc[id]['resources'].concat(curr);
          } else {
            acc[id] = {
              parent: types[id],
              resources: [curr],
            };
          }
          return acc;
        },
        {},
      );

    const groupedValues = groupBy(Object.values(typeToResourcesMapping), t => t.parent);

    const unique = Object.entries(groupedValues).reduce<
      Record<string, ResourceWithNodeConnection[]>
    >((acc, [id, val]) => {
      const uniqueValues = uniqBy(
        val.flatMap(v => v.resources),
        r => r.id,
      );

      acc[id] = uniqueValues;
      return acc;
    }, {});

    return resourceTypes
      .map(rt => ({
        ...rt,
        resources: unique[rt.id] ?? [],
        contentType: getContentTypeFromResourceTypes([rt]).contentType,
      }))
      .filter(rt => rt.resources.length > 0);
  };

  const mapping = resourceToTypeMapping(nodeResources ?? [], resourceTypes ?? []);

  return (
    <div ref={resourceRef}>
      <Row>
        <Button
          outline
          onClick={() =>
            document.getElementById(currentChildNode.id)?.scrollIntoView({ block: 'center' })
          }>
          {t('taxonomy.jumpToStructure')}
        </Button>
        {currentChildNode && currentChildNode.id && (
          <StyledDiv>
            <GroupTopicResources
              node={currentChildNode}
              hideIcon
              onChanged={partialMeta => {
                onCurrentNodeChanged({
                  ...currentChildNode,
                  metadata: { ...currentChildNode.metadata, ...partialMeta },
                });
              }}
            />
          </StyledDiv>
        )}
      </Row>
      <NodeDescription currentNode={currentChildNode} />
      {grouped === 'ungrouped' && (
        <AllResourcesGroup
          key="ungrouped"
          nodeResources={nodeResources ?? []}
          resourceTypes={resourceTypes ?? []}
          currentNodeId={currentChildNode.id}
        />
      )}
      {grouped === 'grouped' &&
        resourceTypes?.map(resourceType => {
          const nodeResource = mapping.find(resource => resource.id === resourceType.id);
          return (
            <ResourceGroup
              key={resourceType.id}
              resourceType={resourceType}
              resources={nodeResource?.resources}
              currentNodeId={currentChildNode.id}
            />
          );
        })}
    </div>
  );
};

export default memo(StructureResources);
