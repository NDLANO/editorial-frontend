/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from "lodash-es";
import { useEffect, useRef, useState, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PageContent, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, Node, NodeType } from "@ndla/types-taxonomy";
import StructureResources from "./resourceComponents/StructureResources";
import SubjectBanner from "./resourceComponents/SubjectBanner";
import RootNode from "./RootNode";
import StructureBanner from "./StructureBanner";
import VersionSelector from "./VersionSelector";
import ErrorBoundary from "../../components/ErrorBoundary";
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
import { getPathsFromUrl } from "../../util/routeHelpers";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import { useLocalStorageBooleanState } from "../WelcomePage/hooks/storedFilterHooks";
import { getResultSubjectIdObject } from "../WelcomePage/utils";

const StickyContainer = styled("div", {
  base: {
    position: "sticky",
    top: "xsmall",
  },
});

const GridWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "xsmall",
    paddingBlock: "xsmall",
    desktopDown: {
      display: "flex",
      flexDirection: "column",
      gap: "xsmall",
    },
  },
});

const MessageBoxWrapper = styled("div", {
  base: {
    gridColumn: "1/-1",
  },
});

const isChildNode = createGuard<NodeChild>("connectionId");

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
  const [rootId] = paths;
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [currentNode, setCurrentNode] = useState<Node | undefined>(undefined);
  const [shouldScroll, setShouldScroll] = useState(!!paths.length);

  const { userPermissions, ndlaId } = useSession();
  const [showFavorites, setShowFavorites] = useLocalStorageBooleanState(REMEMBER_FAVORITE_NODES);
  const [showLmaSubjects, setShowLmaSubjects] = useLocalStorageBooleanState(REMEMBER_LMA_SUBJECTS);
  const [showDaSubjects, setShowDaSubjects] = useLocalStorageBooleanState(REMEMBER_DA_SUBJECTS);
  const [showSaSubjects, setShowSaSubjects] = useLocalStorageBooleanState(REMEMBER_SA_SUBJECTS);
  const [showQuality, setShowQuality] = useLocalStorageBooleanState(REMEMBER_QUALITY);
  const [showMatomoStats, setShowMatomoStats] = useState(false);

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

  return (
    <ErrorBoundary>
      <PageContent variant="wide">
        <GridWrapper>
          {!!messageBox && <MessageBoxWrapper>{messageBox}</MessageBoxWrapper>}
          <div>
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
              showMatomoStats={showMatomoStats}
              setShowMatomoStats={setShowMatomoStats}
            />
            {userDataQuery.isLoading || nodesQuery.isLoading ? (
              <Spinner />
            ) : (
              <div data-testid="structure">
                {nodes.map((node) => (
                  <RootNode
                    openedPaths={getPathsFromUrl(location.pathname)}
                    resourceSectionRef={resourceSection}
                    onNodeSelected={setCurrentNode}
                    isFavorite={!!favoriteNodes[node.id]}
                    key={node.id}
                    node={node}
                    childNodeTypes={childNodeTypes}
                    showQuality={showQuality}
                    rootPath={rootPath}
                  />
                ))}
              </div>
            )}
          </div>
          {!!showResourceColumn && (
            <div>
              {!!currentNode && (
                <StickyContainer ref={resourceSection}>
                  {currentNode.nodeType === "SUBJECT" && (
                    <SubjectBanner subjectNode={currentNode} showQuality={showQuality} users={users} />
                  )}
                  {isChildNode(currentNode) && (
                    <StructureResources
                      currentChildNode={currentNode}
                      setCurrentNode={setCurrentNode}
                      showQuality={showQuality}
                      users={users}
                      showMatomoStats={showMatomoStats}
                    />
                  )}
                </StickyContainer>
              )}
            </div>
          )}
        </GridWrapper>
      </PageContent>
      {!!isTaxonomyAdmin && <VersionSelector />}
    </ErrorBoundary>
  );
};

export default StructureContainer;
