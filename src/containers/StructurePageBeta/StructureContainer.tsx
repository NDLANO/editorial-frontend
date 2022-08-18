import { Taxonomy } from '@ndla/icons/editor';
import { OneColumn } from '@ndla/ui';
import { Spinner } from '@ndla/icons';
import { colors } from '@ndla/core';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Switch } from '@ndla/switch';
import styled from '@emotion/styled';
import Accordion from '../../components/Accordion';
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
import StructureResources from './resourceComponents/StructureResources';
import Footer from '../App/components/Footer';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import StickyVersionSelector from './StickyVersionSelector';
import config from '../../config';
import { createGuard } from '../../util/guards';

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const isChildNode = createGuard<ChildNodeType>('connectionId');

const StyledStructureContainer = styled.div`
  position: relative;
`;

const StructureContainer = () => {
  const location = useLocation();
  const paths = location.pathname.replace('/structureBeta/', '').split('/');
  const [subject, topic, ...rest] = paths;
  const joinedRest = rest.join('/');
  const subtopics = joinedRest.length > 0 ? joinedRest : undefined;
  const params = { subject, topic, subtopics };
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [currentNode, setCurrentNode] = useState<NodeType | undefined>(undefined);
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions } = useSession();
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [showFavorites, setShowFavorites] = useState(
    window.localStorage.getItem(REMEMBER_FAVORITE_NODES) === 'true',
  );
  const resourceSection = useRef<HTMLDivElement>(null);

  const addNodeMutation = useAddNodeMutation();
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
      select: nodes => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
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
    setCurrentNode(undefined);
    setShouldScroll(true);
  }, [taxonomyVersion]);

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
  const nodes = showFavorites
    ? getFavoriteNodes(nodesQuery.data, favoriteNodeIds)
    : nodesQuery.data!;

  const toggleFavorite = (nodeId: string) => {
    if (!favoriteNodes) {
      return;
    }
    const updatedFavorites = favoriteNodeIds.includes(nodeId)
      ? favoriteNodeIds.filter(s => s !== nodeId)
      : [...favoriteNodeIds, nodeId];
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
    await addNodeMutation.mutateAsync({
      body: {
        name,
        nodeType: 'SUBJECT',
        root: true,
      },
      taxonomyVersion,
    });
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
          appearance={'taxonomy'}
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
          <StyledStructureContainer>
            {userDataQuery.isLoading || nodesQuery.isLoading ? (
              <Spinner />
            ) : (
              <StructureWrapper data-cy="structure">
                {nodes!.map(node => (
                  <RootNode
                    renderBeforeTitle={isTaxonomyAdmin ? StructureErrorIcon : undefined}
                    allRootNodes={nodesQuery.data ?? []}
                    openedPaths={getPathsFromUrl(location.pathname)}
                    resourceSectionRef={resourceSection}
                    onNodeSelected={setCurrentNode}
                    isFavorite={!!favoriteNodes[node.id]}
                    key={node.id}
                    node={node}
                    toggleOpen={handleStructureToggle}
                    toggleFavorite={() => toggleFavorite(node.id)}
                  />
                ))}
              </StructureWrapper>
            )}
          </StyledStructureContainer>
        </Accordion>
        {config.versioningEnabled === 'true' && <StickyVersionSelector />}
        {currentNode && isChildNode(currentNode) && (
          <StructureResources
            currentChildNode={currentNode}
            resourceRef={resourceSection}
            onCurrentNodeChanged={setCurrentNode}
          />
        )}
      </OneColumn>
      <Footer showLocaleSelector />
    </ErrorBoundary>
  );
};

export default StructureContainer;
