/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Spinner } from '@ndla/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { breakpoints } from '@ndla/core';
import { NodeChild, Node } from '@ndla/types-taxonomy';
import ErrorBoundary from '../../components/ErrorBoundary';
import { REMEMBER_FAVORITE_NODES, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import { useUserData } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import RootNode from './RootNode';
import { getPathsFromUrl, removeLastItemFromUrl } from '../../util/routeHelpers';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';
import StructureResources from './resourceComponents/StructureResources';
import Footer from '../App/components/Footer';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import StickyVersionSelector from './StickyVersionSelector';
import config from '../../config';
import { createGuard } from '../../util/guards';
import { GridContainer, Column } from '../../components/Layout/Layout';
import StructureBanner from './StructureBanner';
import PlannedResourceFormModal from './plannedResource/PlannedResourceFormModal';

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const isChildNode = createGuard<NodeChild>('connectionId');

const StyledStructureContainer = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const StructureContainer = () => {
  const location = useLocation();
  const paths = location.pathname.replace('/structure/', '').split('/');
  const [subject, topic, ...rest] = paths;
  const joinedRest = rest.join('/');
  const subtopics = joinedRest.length > 0 ? joinedRest : undefined;
  const params = { subject, topic, subtopics };
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [currentNode, setCurrentNode] = useState<Node | undefined>(undefined);
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions } = useSession();
  const [showFavorites, setShowFavorites] = useState(
    window.localStorage.getItem(REMEMBER_FAVORITE_NODES) === 'true',
  );
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

  const resourceSection = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const userDataQuery = useUserData();
  const favoriteNodes =
    userDataQuery.data?.favoriteSubjects?.reduce<{ [x: string]: boolean }>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {}) ?? {};
  const favoriteNodeIds = Object.keys(favoriteNodes);
  const nodesQuery = useNodes(
    { language: i18n.language, isRoot: true, taxonomyVersion },
    {
      select: (nodes) => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
    },
  );

  useEffect(() => {
    if (currentNode && shouldScroll) {
      document.getElementById(currentNode.id)?.scrollIntoView({ block: 'center' });
      setShouldScroll(false);
    }
  }, [currentNode, shouldScroll]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setCurrentNode(undefined);
    }
    setShouldScroll(true);
  }, [taxonomyVersion]);

  const handleStructureToggle = (path: string) => {
    const { search } = location;
    const currentPath = location.pathname.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.subject && !newPath.includes(params.subject);
    navigate(`/structure/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const getFavoriteNodes = (nodes: Node[] = [], favoriteNodeIds: string[] = []) => {
    return nodes.filter((node) => favoriteNodeIds.includes(node.id));
  };

  const nodes = showFavorites
    ? getFavoriteNodes(nodesQuery.data, [...favoriteNodeIds, subject])
    : nodesQuery.data!;

  const toggleShowFavorites = () => {
    window.localStorage.setItem(REMEMBER_FAVORITE_NODES, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  };

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ErrorBoundary>
      <Wrapper>
        <GridContainer breakpoint={breakpoints.desktop}>
          <Column colStart={1} colEnd={7}>
            <StructureBanner onChange={toggleShowFavorites} checked={showFavorites} />
            <StyledStructureContainer>
              {userDataQuery.isInitialLoading || nodesQuery.isInitialLoading ? (
                <Spinner />
              ) : (
                <StructureWrapper data-cy="structure">
                  {nodes!.map((node) => (
                    <RootNode
                      renderBeforeTitle={StructureErrorIcon}
                      openedPaths={getPathsFromUrl(location.pathname)}
                      resourceSectionRef={resourceSection}
                      onNodeSelected={setCurrentNode}
                      isFavorite={!!favoriteNodes[node.id]}
                      key={node.id}
                      node={node}
                      toggleOpen={handleStructureToggle}
                      setShowAddTopicModal={setShowAddTopicModal}
                    />
                  ))}
                </StructureWrapper>
              )}
            </StyledStructureContainer>
          </Column>
          <Column colStart={7} colEnd={13}>
            {currentNode && isChildNode(currentNode) && (
              <StructureResources
                currentChildNode={currentNode}
                setCurrentNode={setCurrentNode}
                resourceRef={resourceSection}
              />
            )}
          </Column>
        </GridContainer>
        {showAddTopicModal && (
          <PlannedResourceFormModal
            onClose={() => setShowAddTopicModal(false)}
            articleType="topic-article"
            nodeId={currentNode?.id ?? ''}
            userData={userDataQuery.data}
          />
        )}
        {config.versioningEnabled === 'true' && isTaxonomyAdmin && <StickyVersionSelector />}
        <Footer showLocaleSelector />
      </Wrapper>
    </ErrorBoundary>
  );
};

export default StructureContainer;
