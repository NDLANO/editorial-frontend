/*
 * Copyright (c) 2017-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

//@ts-ignore
import { OneColumn, Spinner } from '@ndla/ui';
import { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Taxonomy } from '@ndla/icons/editor';
import { Switch } from '@ndla/switch';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import InlineAddButton from '../../components/InlineAddButton';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';
import { ButtonAppearance } from '../../components/Accordion/types';
import { REMEMBER_FAVOURITE_NODES, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import Footer from '../App/components/Footer';
import StructureResources from './resourceComponents/StructureResources';
import { getPathsFromUrl, removeLastItemFromUrl } from '../../util/routeHelpers';
import StructureRoot from './StructureRoot';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';
import { useSession } from '../Session/SessionProvider';
import { useNodes } from '../../modules/taxonomy/nodes/nodeQueries';
import { ChildNodeType, NodeType } from '../../modules/taxonomy/nodes/nodeApiTypes';
import { useAddNodeMutation } from '../../modules/taxonomy/nodes/nodeMutations';

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

export interface StructureRouteParams {
  root?: string;
  child?: string;
  children?: string;
}

export const StructureContainer = ({
  location,
  match,
  history,
}: RouteComponentProps<StructureRouteParams>) => {
  const { t, i18n } = useTranslation();
  const { userAccess } = useSession();
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentNode, setCurrentNode] = useState<ChildNodeType | undefined>(undefined);
  const resourceSection = useRef<HTMLDivElement>(null);

  const userDataQuery = useUserData();
  const favoriteNodes = userDataQuery.data?.favoriteSubjects ?? [];

  const nodesQuery = useNodes(
    { language: i18n.language, nodeType: 'SUBJECT' },
    {
      select: nodes => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
    },
  );
  const addNodeMutation = useAddNodeMutation();
  const updateUserDataMutation = useUpdateUserDataMutation();

  useLayoutEffect(() => {
    const initialShowFavorites = window.localStorage.getItem(REMEMBER_FAVOURITE_NODES);
    setShowFavorites(initialShowFavorites === 'true');
  }, []);

  const getFavoriteNodes = (nodes: NodeType[] = [], favoriteNodeIds: string[] = []) => {
    return nodes.filter(node => favoriteNodeIds.includes(node.id));
  };

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
    window.localStorage.setItem(REMEMBER_FAVOURITE_NODES, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  };

  const handleStructureToggle = (path: string) => {
    const { url, params } = match;
    const { search } = location;
    const currentPath = url.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.root && !newPath.includes(params.root);
    history.replace(`/structure/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const addNode = async (name: string) => {
    await addNodeMutation.mutateAsync({ name, nodeType: 'TOPIC' });
  };

  const isTaxonomyAdmin = userAccess?.includes(TAXONOMY_ADMIN_SCOPE);

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
              // @ts-ignore
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
                  <StructureRoot
                    renderBeforeTitle={isTaxonomyAdmin ? StructureErrorIcon : undefined}
                    allRootNodes={nodesQuery.data ?? []}
                    openedPaths={getPathsFromUrl(match.url)}
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
        {currentNode && (
          <StructureResources
            resourceRef={resourceSection}
            currentChildNode={currentNode}
            updateCurrentChildNode={setCurrentNode}
          />
        )}
      </OneColumn>
      <Footer showLocaleSelector />
    </ErrorBoundary>
  );
};

export default withRouter(StructureContainer);
