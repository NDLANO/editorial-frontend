import { Taxonomy } from '@ndla/icons/editor';
import { Spinner } from '@ndla/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Switch } from '@ndla/switch';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import { REMEMBER_FAVORITE_NODES, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import InlineAddButton from '../../components/InlineAddButton';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import { useUserData } from '../../modules/draft/draftQueries';
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
import { GridContainer, MainArea, LeftColumn, RightColumn } from '../../components/Layout/Layout';

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const isChildNode = createGuard<ChildNodeType>('connectionId');

const StyledStructureContainer = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StructureContainer = () => {
  const location = useLocation();
  const paths = location.pathname.replace('/structure/', '').split('/');
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
    const currentPath = location.pathname.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.subject && !newPath.includes(params.subject);
    navigate(`/structure/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const getFavoriteNodes = (nodes: NodeType[] = [], favoriteNodeIds: string[] = []) => {
    return nodes.filter(node => favoriteNodeIds.includes(node.id));
  };

  const nodes = showFavorites
    ? getFavoriteNodes(nodesQuery.data, [...favoriteNodeIds, subject])
    : nodesQuery.data!;

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
      <Wrapper>
        <GridContainer>
          <LeftColumn>
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
                isTaxonomyAdmin && (
                  <InlineAddButton title={t('taxonomy.addSubject')} action={addNode} />
                )
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
                        renderBeforeTitle={StructureErrorIcon}
                        allRootNodes={nodesQuery.data ?? []}
                        openedPaths={getPathsFromUrl(location.pathname)}
                        onNodeSelected={setCurrentNode}
                        isFavorite={!!favoriteNodes[node.id]}
                        key={node.id}
                        node={node}
                        toggleOpen={handleStructureToggle}
                      />
                    ))}
                  </StructureWrapper>
                )}
              </StyledStructureContainer>
            </Accordion>
          </LeftColumn>
          <RightColumn>
            {currentNode && isChildNode(currentNode) && (
              <StructureResources currentChildNode={currentNode} />
            )}
          </RightColumn>
          <MainArea>
            {config.versioningEnabled === 'true' && isTaxonomyAdmin && <StickyVersionSelector />}
          </MainArea>
        </GridContainer>

        <Footer showLocaleSelector />
      </Wrapper>
    </ErrorBoundary>
  );
};

export default StructureContainer;
