/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useEffect, useRef, useState, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { breakpoints, spacing } from "@ndla/core";
import { Spinner } from "@ndla/primitives";
import { NodeChild, Node, NodeType } from "@ndla/types-taxonomy";
import StructureErrorIcon from "./folderComponents/StructureErrorIcon";
import StructureResources from "./resourceComponents/StructureResources";
import SubjectBanner from "./resourceComponents/SubjectBanner";
import RootNode from "./RootNode";
import StructureBanner from "./StructureBanner";
import VersionSelector from "./VersionSelector";
import ErrorBoundary from "../../components/ErrorBoundary";
import { GridContainer, Column } from "../../components/Layout/Layout";
import {
  REMEMBER_DA_SUBJECTS,
  REMEMBER_FAVORITE_NODES,
  REMEMBER_SA_SUBJECTS,
  REMEMBER_LMA_SUBJECTS,
  TAXONOMY_ADMIN_SCOPE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  REMEMBER_QUALITY,
  DRAFT_RESPONSIBLE,
} from "../../constants";
import { useAuth0Responsibles } from "../../modules/auth0/auth0Queries";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { createGuard } from "../../util/guards";
import { getPathsFromUrl, removeLastItemFromUrl } from "../../util/routeHelpers";
import Footer from "../App/components/FooterWrapper";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import { useLocalStorageBooleanState } from "../WelcomePage/hooks/storedFilterHooks";
import { getResultSubjectIdObject } from "../WelcomePage/utils";

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: ${spacing.small};
`;

const isChildNode = createGuard<NodeChild>("connectionId");

const StyledStructureContainer = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding-block-start: ${spacing.nsmall};
`;

const getNodes = (
  allNodes: Node[] | undefined = [],
  lmaSubjectIds: string[],
  daSubjectIds: string[],
  saSubjectIds: string[],
  favoriteNodeIds: string[],
  rootId: string,
): Node[] => {
  const filteredNodes =
    lmaSubjectIds.length || favoriteNodeIds.length || daSubjectIds.length || saSubjectIds.length
      ? allNodes.filter((node) =>
          [...lmaSubjectIds, ...favoriteNodeIds, ...daSubjectIds, ...saSubjectIds, rootId].includes(node.id),
        )
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
  rootNodeType = "SUBJECT",
  childNodeTypes = ["TOPIC"],
  rootPath = "/structure/",
  showResourceColumn = true,
  messageBox,
}: Props) => {
  const location = useLocation();
  const paths = location.pathname.replace(rootPath, "").split("/");
  const [rootId, childId, ...rest] = paths;
  const joinedRest = rest.join("/");
  const children = joinedRest.length > 0 ? joinedRest : undefined;
  const params = { rootId, childId, children };
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [currentNode, setCurrentNode] = useState<Node | undefined>(undefined);
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions, ndlaId } = useSession();
  const [showFavorites, setShowFavorites] = useLocalStorageBooleanState(REMEMBER_FAVORITE_NODES);
  const [showLmaSubjects, setShowLmaSubjects] = useLocalStorageBooleanState(REMEMBER_LMA_SUBJECTS);
  const [showDaSubjects, setShowDaSubjects] = useLocalStorageBooleanState(REMEMBER_DA_SUBJECTS);
  const [showSaSubjects, setShowSaSubjects] = useLocalStorageBooleanState(REMEMBER_SA_SUBJECTS);
  const [showQuality, setShowQuality] = useLocalStorageBooleanState(REMEMBER_QUALITY);

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
  const rootOrContext = rootNodeType === "PROGRAMME" ? { isRoot: true } : { isContext: true };
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

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    { select: (users) => keyBy(users, (u) => u.app_metadata.ndla_id) },
  );

  useEffect(() => {
    if (currentNode && shouldScroll) {
      document.getElementById(currentNode.id)?.scrollIntoView({ block: "center" });
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
    const currentPath = location.pathname.replace(rootPath, "");
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.rootId && !newPath.includes(params.rootId);
    navigate(`${rootPath}${newPath.concat(deleteSearch ? "" : search)}`);
  };

  const resultSubjectIdObject = useMemo(
    () => getResultSubjectIdObject(ndlaId, nodesQuery.data),
    [ndlaId, nodesQuery.data],
  );

  const rootNodes = getNodes(
    nodesQuery.data,
    showLmaSubjects ? resultSubjectIdObject.subjectLMA.map((s) => s.id) : [],
    showDaSubjects ? resultSubjectIdObject.subjectDA.map((s) => s.id) : [],
    showSaSubjects ? resultSubjectIdObject.subjectSA.map((s) => s.id) : [],
    showFavorites ? favoriteNodeIds : [],
    rootId,
  );

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);
  const nodes = isTaxonomyAdmin
    ? rootNodes
    : rootNodes.filter((node) => node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true");

  const addChildTooltip = childNodeTypes.includes("PROGRAMME")
    ? t("taxonomy.addNode", { nodeType: t("taxonomy.nodeType.PROGRAMME") })
    : t("taxonomy.addTopic");

  return (
    <ErrorBoundary>
      <Wrapper>
        <GridContainer breakpoint={breakpoints.desktop}>
          {messageBox && <Column>{messageBox}</Column>}
          <Column colEnd={7}>
            <StructureBanner
              setShowFavorites={setShowFavorites}
              showFavorites={showFavorites}
              setShowLmaSubjects={setShowLmaSubjects}
              setShowDaSubjects={setShowDaSubjects}
              setShowSaSubjects={setShowSaSubjects}
              showLmaSubjects={showLmaSubjects}
              showDaSubjects={showDaSubjects}
              showSaSubjects={showSaSubjects}
              nodeType={rootNodeType}
              hasLmaSubjects={!!resultSubjectIdObject.subjectLMA.length}
              hasDaSubjects={!!resultSubjectIdObject.subjectDA.length}
              hasSaSubjects={!!resultSubjectIdObject.subjectSA.length}
              showQuality={showQuality}
              setShowQuality={setShowQuality}
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
                      childNodeTypes={childNodeTypes}
                      addChildTooltip={addChildTooltip}
                      showQuality={showQuality}
                    />
                  ))}
                </StructureWrapper>
              )}
            </StyledStructureContainer>
          </Column>
          {showResourceColumn && (
            <Column colStart={7}>
              {currentNode && (
                <StickyContainer ref={resourceSection}>
                  {currentNode.nodeType === "SUBJECT" && (
                    <SubjectBanner subjectNode={currentNode} showQuality={showQuality} users={users} />
                  )}
                  {isChildNode(currentNode) && (
                    <StructureResources currentChildNode={currentNode} showQuality={showQuality} users={users} />
                  )}
                </StickyContainer>
              )}
            </Column>
          )}
        </GridContainer>
        {isTaxonomyAdmin && <VersionSelector />}
        <Footer showLocaleSelector />
      </Wrapper>
    </ErrorBoundary>
  );
};

export default StructureContainer;
