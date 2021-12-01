/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Copy } from '@ndla/icons/action';
import {
  fetchResource,
  createResource,
  createResourceResourceType,
  fetchResourceTranslations,
  setResourceTranslation,
} from '../../../../modules/taxonomy';
import { cloneDraft } from '../../../../modules/draft/draftApi';
import { learningpathCopy } from '../../../../modules/learningpath/learningpathApi';
import { ResourceTranslation } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import MenuItemDropdown from './components/MenuItemDropdown';
import MenuItemButton from './components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import { getIdFromUrn, retrieveBreadCrumbs } from '../../../../util/taxonomyHelpers';
import { RESOURCES_WITH_NODE_CONNECTION } from '../../../../queryKeys';
import AlertModal from '../../../../components/AlertModal';
import {
  ChildNodeType,
  NodeType,
  ResourceWithNodeConnection,
} from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import { fetchNodeResources, fetchNodes } from '../../../../modules/taxonomy/nodes/nodeApi';
import { usePostResourceForNodeMutation } from '../../../../modules/taxonomy/nodes/nodeMutations';

interface Props {
  toNode: NodeType | ChildNodeType;
  structure: NodeType[];
  onClose: () => void;
}

const iconCss = css`
  width: 8px;
  height: 8px;
`;

const CopyResources = ({ toNode, structure, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [showCopySearch, setShowCopySearch] = useState(false);
  const [showCloneSearch, setShowCloneSearch] = useState(false);
  const qc = useQueryClient();
  const [showAlertModal, setShowAlertModal] = useState(false);

  const postNodeResource = usePostResourceForNodeMutation();

  useEffect(() => {
    (async () => {
      const childNodes = 'childNodes' in toNode ? toNode.childNodes ?? [] : [];
      const allNodes = await fetchNodes({ language: locale });
      const newNodes = allNodes
        .filter(n => !childNodes.some(child => n.id === child.id))
        .map(n => ({ ...n, description: getNodeBreadcrumb(n, allNodes) }));
      setNodes(newNodes);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getNodeBreadcrumb = (currentNode: NodeType, allNodes: NodeType[]) => {
    if (!currentNode.path) return undefined;
    const breadCrumbs = retrieveBreadCrumbs({
      nodePath: currentNode.path,
      structure,
      allNodes,
      title: currentNode.name,
    });
    return breadCrumbs.map(crumb => crumb.name).join(' > ');
  };

  const addResourcesToNode = async (
    resources: Pick<ResourceWithNodeConnection, 'primary' | 'rank' | 'id'>[],
  ) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on nodes with plenty of resources. The for-loop can be replaced with reduce().

    for (let i = 0; i < resources.length; i++) {
      const { primary, rank, id } = resources[i];
      await postNodeResource.mutateAsync(
        { body: { primary, rank, resourceId: id, nodeId: toNode.id } },
        { onError: e => handleError(e) },
      );
    }
  };

  const cloneResourceResourceTypes = async (resourceTypeIds: string[], resourceId: string) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on nodes with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resourceTypeIds.length; i++) {
      await createResourceResourceType({ resourceId, resourceTypeId: resourceTypeIds[i] });
    }
  };

  const cloneResourceTranslations = async (translations: ResourceTranslation[], id: string) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on nodes with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < translations.length; i++) {
      await setResourceTranslation(id, translations[i].language, { name: translations[i].name });
    }
  };

  const clonedResource = async (
    newResourceBody: { contentUri?: string; name: string },
    oldResource: ResourceWithNodeConnection,
  ) => {
    const newResourcePath = await createResource(newResourceBody);
    const newResourceUrn = newResourcePath.split('/').pop()!;
    const resourceTypeIds = oldResource.resourceTypes.map(rt => rt.id);
    await cloneResourceResourceTypes(resourceTypeIds, newResourceUrn);
    const resourceTranslations = await fetchResourceTranslations(oldResource.id);
    await cloneResourceTranslations(resourceTranslations, newResourceUrn);
    return await fetchResource(newResourceUrn, locale);
  };

  const cloneResource = async (resource: ResourceWithNodeConnection) => {
    const resourceType = resource.contentUri?.split(':')[1];
    const resourceId = resource.contentUri ? getIdFromUrn(resource.contentUri!) : null;
    if (resourceType === 'article' && resourceId) {
      const clonedArticle = await cloneDraft(resourceId, undefined, false);
      const newResourceBody = {
        contentUri: `urn:article:${clonedArticle.id}`,
        name: resource.name,
      };
      return await clonedResource(newResourceBody, resource);
    } else if (resourceType === 'learningpath' && resourceId) {
      const newLearningpathBody = {
        title: resource.name,
        language: locale,
      };
      const clonedLearningpath = await learningpathCopy(resourceId, newLearningpathBody);
      const newResourceBody = {
        contentUri: `urn:learningpath:${clonedLearningpath.id}`,
        name: resource.name,
      };
      return await clonedResource(newResourceBody, resource);
    } else {
      return await clonedResource({ name: resource.name }, resource);
    }
  };

  const cloneResources = async (resources: ResourceWithNodeConnection[]) => {
    const clonedResources = [];
    // This is made so the code runs sequentially and not cause server overflow
    // on nodes with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resources.length; i++) {
      const clonedResource = await cloneResource(resources[i]);
      clonedResources.push(clonedResource);
    }
    return clonedResources;
  };

  const copyResources = async (fromNode: NodeType) => {
    try {
      const resources = await fetchNodeResources(fromNode.id);
      await addResourcesToNode(resources);
      await qc.invalidateQueries([RESOURCES_WITH_NODE_CONNECTION, toNode.id, { language: locale }]);
    } catch (e) {
      setShowAlertModal(true);
      handleError(e);
    }
  };

  const copyAndCloneResources = async (fromNode: NodeType) => {
    try {
      const resources = await fetchNodeResources(fromNode.id);
      const clonedResources = await cloneResources(resources);
      await addResourcesToNode(clonedResources);
      await qc.invalidateQueries([RESOURCES_WITH_NODE_CONNECTION, toNode.id, { language: locale }]);
    } catch (e) {
      setShowAlertModal(true);
      handleError(e);
    }
  };

  return (
    <>
      {!showCopySearch ? (
        <MenuItemButton
          stripped
          onClick={() => {
            setShowCopySearch(true);
            setShowCloneSearch(false);
          }}>
          <RoundIcon small smallIcon icon={<Copy css={iconCss} />} />
          {t('taxonomy.copyResources')}
        </MenuItemButton>
      ) : (
        <MenuItemDropdown
          placeholder={t('taxonomy.existingNode')}
          searchResult={nodes}
          onClose={onClose}
          onSubmit={copyResources}
          icon={<Copy />}
          smallIcon
          showPagination
        />
      )}
      {!showCloneSearch ? (
        <MenuItemButton
          stripped
          onClick={() => {
            setShowCopySearch(false);
            setShowCloneSearch(true);
          }}>
          <RoundIcon small smallIcon icon={<Copy css={iconCss} />} />
          {t('taxonomy.copyAndCloneResources')}
        </MenuItemButton>
      ) : (
        <MenuItemDropdown
          placeholder={t('taxonomy.existingNode')}
          searchResult={nodes}
          onClose={onClose}
          onSubmit={copyAndCloneResources}
          icon={<Copy />}
          smallIcon
          showPagination
        />
      )}
      <AlertModal
        show={showAlertModal}
        text={t('taxonomy.resource.copyError')}
        actions={[
          {
            text: t('alertModal.continue'),
            onClick: () => {
              setShowAlertModal(false);
            },
          },
        ]}
        onCancel={() => {
          setShowAlertModal(false);
        }}
      />
    </>
  );
};

export default CopyResources;
