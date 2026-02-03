/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { Node, NodeType } from "@ndla/types-taxonomy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { TAXONOMY_ADMIN_SCOPE, TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../constants";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getPathsFromUrl } from "../../util/routeHelpers";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import { getResultSubjectIdObject } from "../WelcomePage/utils";
import { usePreferences } from "./PreferencesProvider";
import RootNode from "./RootNode";
import StructureBanner from "./StructureBanner";

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
}

const LeftColumn = ({ rootNodeType = "SUBJECT", childNodeTypes = ["TOPIC"], rootPath = "/structure/" }: Props) => {
  const location = useLocation();
  const paths = location.pathname.replace(rootPath, "").split("/");
  const [rootId] = paths;
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { userPermissions, ndlaId } = useSession();
  const { showFavorites, showLmaSubjects, showDaSubjects, showSaSubjects } = usePreferences();

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
      nodeType: [rootNodeType],
      ...rootOrContext,
      taxonomyVersion,
    },
    {
      select: (nodes) => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
    },
  );

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
    <div>
      <StructureBanner
        nodeType={rootNodeType}
        hasLmaSubjects={!!resultSubjectIdObject.subjectLMA.length}
        hasDaSubjects={!!resultSubjectIdObject.subjectDA.length}
        hasSaSubjects={!!resultSubjectIdObject.subjectSA.length}
      />
      {userDataQuery.isLoading || nodesQuery.isLoading ? (
        <Spinner />
      ) : (
        <div data-testid="structure">
          {nodes.map((node) => (
            <RootNode
              openedPaths={getPathsFromUrl(location.pathname)}
              isFavorite={!!favoriteNodes[node.id]}
              key={node.id}
              node={node}
              childNodeTypes={childNodeTypes}
              rootPath={rootPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeftColumn;
