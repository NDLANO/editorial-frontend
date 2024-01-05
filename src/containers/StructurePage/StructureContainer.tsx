/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { breakpoints } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { NodeChild, Node, NodeType } from '@ndla/types-taxonomy';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';
import StructureResources from './resourceComponents/StructureResources';
import RootNode from './RootNode';
import StickyVersionSelector from './StickyVersionSelector';
import StructureBanner from './StructureBanner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { GridContainer, Column } from '../../components/Layout/Layout';
import {
  REMEMBER_FAVORITE_NODES,
  REMEMBER_LMA_SUBJECTS,
  TAXONOMY_ADMIN_SCOPE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
} from '../../constants';
import { useUserData } from '../../modules/draft/draftQueries';
import { useNodes } from '../../modules/nodes/nodeQueries';
import { createGuard } from '../../util/guards';
import { getPathsFromUrl, removeLastItemFromUrl } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
import { useSession } from '../Session/SessionProvider';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

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

const getNodes = (
  allNodes: Node[] | undefined = [],
  lmaSubjectNodes: Node[] | undefined = [],
  favoriteNodeIds: string[],
  rootId: string,
  showFavorites: boolean,
  showLmaSubjects: boolean,
): Node[] => {
  let filteredIds: string[] = [];
  if (showLmaSubjects) {
    filteredIds = lmaSubjectNodes.map((el) => el.id);
  }
  if (showFavorites) {
    filteredIds = filteredIds.concat(favoriteNodeIds);
  }

  const filteredNodes = filteredIds.length
    ? allNodes.filter((node) => [...filteredIds, rootId].includes(node.id))
    : allNodes;
  return filteredNodes;
};

interface Props {
  rootNodeType?: NodeType;
  childNodeTypes?: NodeType[];
  rootPath?: string;
  showResourceColumn?: boolean;
  messageBox?: ReactNode;
}

const StructureContainer = ({
  rootNodeType = 'SUBJECT',
  childNodeTypes = ['TOPIC'],
  rootPath = '/structure/',
  showResourceColumn = true,
  messageBox,
}: Props) => {
  const location = useLocation();
  const paths = location.pathname.replace(rootPath, '').split('/');
  const [rootId, childId, ...rest] = paths;
  const joinedRest = rest.join('/');
  const children = joinedRest.length > 0 ? joinedRest : undefined;
  const params = { rootId, childId, children };
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [currentNode, setCurrentNode] = useState<Node | undefined>(undefined);
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions, ndlaId } = useSession();
  const [showFavorites, setShowFavorites] = useState(
    localStorage.getItem(REMEMBER_FAVORITE_NODES) === 'true',
  );
  const [showLmaSubjects, setShowLmaSubjects] = useState(
    localStorage.getItem(REMEMBER_LMA_SUBJECTS) === 'true',
  );

  const resourceSection = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const userDataQuery = useUserData();
  const favoriteNodes =
    userDataQuery.data?.favoriteSubjects?.reduce<{ [x: string]: boolean }>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {}) ?? {};
  const favoriteNodeIds = Object.keys(favoriteNodes);
  // Need different filtering for programme
  const rootOrContext = rootNodeType === 'PROGRAMME' ? { isRoot: true } : { isContext: true };
  const nodesQuery = useNodes(
    {
      language: i18n.language,
      nodeType: rootNodeType,
      ...rootOrContext,
      taxonomyVersion,
    },
    {
      select: (nodes) => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
    },
  );
  const lmaSubjectsQuery = useNodes(
    {
      language: i18n.language,
      nodeType: rootNodeType,
      ...rootOrContext,
      taxonomyVersion,
      key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
      value: ndlaId,
    },
    {
      select: (nodes) => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      enabled: !!ndlaId,
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
    const currentPath = location.pathname.replace(rootPath, '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.rootId && !newPath.includes(params.rootId);
    navigate(`${rootPath}${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const nodes = getNodes(
    nodesQuery.data,
    lmaSubjectsQuery.data,
    favoriteNodeIds,
    rootId,
    showFavorites,
    showLmaSubjects,
  );

  const toggleShowFavorites = useCallback(() => {
    localStorage.setItem(REMEMBER_FAVORITE_NODES, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  }, [showFavorites]);

  const toggleShowLmaSubjects = useCallback(() => {
    localStorage.setItem(REMEMBER_LMA_SUBJECTS, (!showLmaSubjects).toString());
    setShowLmaSubjects(!showLmaSubjects);
  }, [showLmaSubjects]);

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const addChildTooltip = childNodeTypes.includes('TOPIC')
    ? t('taxonomy.addTopicHeader')
    : t('taxonomy.addNode', { nodeType: t('taxonomy.nodeType.PROGRAMME') });

  return (
    <ErrorBoundary>
      <Wrapper>
        <GridContainer breakpoint={breakpoints.desktop}>
          {messageBox && <Column>{messageBox}</Column>}
          <Column colEnd={7}>
            <StructureBanner
              setShowFavorites={toggleShowFavorites}
              showFavorites={showFavorites}
              setShowLmaSubjects={toggleShowLmaSubjects}
              showLmaSubjects={showLmaSubjects}
              nodeType={rootNodeType}
              hasLmaSubjects={!!lmaSubjectsQuery.data?.length}
            />
            <StyledStructureContainer>
              {userDataQuery.isLoading || nodesQuery.isLoading ? (
                <Spinner />
              ) : (
                <StructureWrapper data-testid="structure">
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
                      addChildTooltip={addChildTooltip}
                      childNodeTypes={childNodeTypes}
                    />
                  ))}
                </StructureWrapper>
              )}
            </StyledStructureContainer>
          </Column>
          {showResourceColumn && (
            <Column colStart={7}>
              {currentNode && isChildNode(currentNode) && (
                <StructureResources
                  currentChildNode={currentNode}
                  setCurrentNode={setCurrentNode}
                  resourceRef={resourceSection}
                />
              )}
            </Column>
          )}
        </GridContainer>
        {isTaxonomyAdmin && <StickyVersionSelector />}
        <Footer showLocaleSelector />
      </Wrapper>
    </ErrorBoundary>
  );
};

export default StructureContainer;
