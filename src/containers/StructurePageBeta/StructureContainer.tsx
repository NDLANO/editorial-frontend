import { Taxonomy } from '@ndla/icons/lib/editor';
import { OneColumn, Spinner } from '@ndla/ui';
import { colors } from '@ndla/core';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Switch } from '@ndla/switch';
import styled from '@emotion/styled';
import Accordion from '../../components/Accordion';
import { ButtonAppearance } from '../../components/Accordion/types';
import ErrorBoundary from '../../components/ErrorBoundary';
import { REMEMBER_FAVORITE_NODES, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import InlineAddButton from '../../components/InlineAddButton';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import RootNode from './RootNode';
import { getPathsFromUrl, removeLastItemFromUrl } from '../../util/routeHelpers';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';
const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;
const StructureContainer = () => {
  const location = useLocation();
  const [subject, topic, ...rest] = location.pathname.replace('/structure/', '').split('/');
  const joinedRest = rest.join('/');
  const subtopics = joinedRest.length > 0 ? joinedRest : undefined;
  const params = { subject, topic, subtopics };
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentNode, setCurrentNode] = useState<ChildNodeType | undefined>(undefined);

  const { userPermissions } = useSession();
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const resourceSection = useRef<HTMLDivElement>(null);

  const addNodeMutation = useAddNodeMutation();
  const userDataQuery = useUserData();
  const favoriteNodes = userDataQuery.data?.favoriteSubjects ?? [];
  const nodesQuery = useNodes(
    { language: i18n.language, nodeType: 'SUBJECT' },
    {
      select: nodes => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
    },
  );
  const handleStructureToggle = (path: string) => {
    const { search } = location;
    const currentPath = location.pathname.replace('/structureBeta/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.subject && !newPath.includes(params.subject);
    navigate(`/structureBeta/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const getFavoriteNodes = (nodes: NodeType[] = [], favoriteNodeIds: string[] = []) => {
    return nodes.filter(node => favoriteNodeIds.includes(node.id));
  };

  const updateUserDataMutation = useUpdateUserDataMutation();
  const nodes = showFavorites ? getFavoriteNodes(nodesQuery.data, favoriteNodes) : nodesQuery.data!;

  const toggleFavorite = (nodeId: string) => {
    if (!favoriteNodes) {
      return;
    }
    const updatedFavorites = favoriteNodes.includes(nodeId)
      ? favoriteNodes.filter(s => s !== nodeId)
      : [...favoriteNodes, nodeId];
    updateUserDataMutation.mutate({ favoriteSubjects: updatedFavorites });
  };

  const toggleStructure = () => {
    setEditStructureHidden(!editStructureHidden);
  };

  const toggleShowFavorites = () => {
    window.localStorage.setItem(REMEMBER_FAVORITE_NODES, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  };

  const addNode = async (name: string) => {
    await addNodeMutation.mutateAsync({ name, nodeType: 'TOPIC' });
  };

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ErrorBoundary>
      <OneColumn>
        <Accordion
          handleToggle={toggleStructure}
          header={
            <>
              <Taxonomy className="c-icon--medium" />
              {t('taxonomy.editStructure')}
            </>
          }
          appearance={ButtonAppearance.TAXONOMY}
          addButton={
            isTaxonomyAdmin && <InlineAddButton title={t('taxonomy.addSubject')} action={addNode} />
          }
          toggleSwitch={
            <Switch
              onChange={toggleShowFavorites}
              checked={showFavorites}
              label={t('taxonomy.favorites')}
              id={'favorites'}
              //@ts-ignore
              style={{ color: colors.white, width: '15.2em' }}
            />
          }
          hidden={editStructureHidden}>
          <div id="plumbContainer">
            {userDataQuery.isLoading || nodesQuery.isLoading ? (
              <Spinner />
            ) : (
              <StructureWrapper>
                {nodes!.map(node => (
                  <RootNode
                    renderBeforeTitle={isTaxonomyAdmin ? StructureErrorIcon : undefined}
                    allRootNodes={nodesQuery.data ?? []}
                    openedPaths={getPathsFromUrl(location.pathname)}
                    resourceSectionRef={resourceSection}
                    onChildNodeSelected={setCurrentNode}
                    favoriteNodeIds={favoriteNodes}
                    key={node.id}
                    node={node}
                    toggleOpen={handleStructureToggle}
                    toggleFavorite={() => toggleFavorite(node.id)}
                  />
                ))}
              </StructureWrapper>
            )}
          </div>
        </Accordion>
      </OneColumn>
    </ErrorBoundary>
  );
};

export default StructureContainer;
