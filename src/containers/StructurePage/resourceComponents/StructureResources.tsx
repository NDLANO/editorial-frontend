/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { keyBy } from "lodash-es";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import ResourcesContainer from "./ResourcesContainer";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import {
  NodeResourceMeta,
  useNodeResourceMetas,
  useResourcesWithNodeConnection,
} from "../../../modules/nodes/nodeQueries";
import { useAllResourceTypes } from "../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

export interface ResourceWithNodeConnectionAndMeta extends NodeChild {
  contentMeta?: NodeResourceMeta;
}

interface Props {
  currentChildNode: NodeChild;
  setCurrentNode: (changedNode: NodeChild) => void;
  showQuality: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}

const getMissingResourceType = (t: TFunction): ResourceType & { disabled?: boolean } => ({
  id: "missing",
  name: t("taxonomy.missingResourceType"),
  disabled: true,
  supportedLanguages: [],
  translations: [],
  subtypes: [],
});

const missingObject = {
  id: "missing",
  name: "",
  connectionId: "",
  parentId: "",
  supportedLanguages: [],
  translations: [],
};
const withMissing = (r: NodeChild): NodeChild => ({
  ...r,
  resourceTypes: [missingObject],
});

const StructureResources = ({ currentChildNode, setCurrentNode, showQuality, users }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const grouped = currentChildNode?.metadata?.customFields["topic-resources"] ?? "grouped";

  const { data: nodeResources, isPending: nodeResourcesIsPending } = useResourcesWithNodeConnection(
    {
      id: currentChildNode.id,
      language: i18n.language,
      includeContexts: true,
      filterProgrammes: true,
      isVisible: false,
      taxonomyVersion,
    },
    {
      select: (resources) => resources.map((r) => (r.resourceTypes.length > 0 ? r : withMissing(r))),
    },
  );

  const { data: nodeResourceMetas, isPending: contentMetaIsPending } = useNodeResourceMetas(
    {
      nodeId: currentChildNode.id,
      ids:
        nodeResources
          ?.map((r) => r.contentUri)
          .concat(currentChildNode.contentUri)
          .filter<string>((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    },
    { enabled: !!currentChildNode.contentUri || (!!nodeResources && !!nodeResources?.length) },
  );

  const keyedMetas = useMemo(() => keyBy(nodeResourceMetas, (m) => m.contentUri), [nodeResourceMetas]);

  const { data: resourceTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: (resourceTypes) => resourceTypes.concat(getMissingResourceType(t)),
    },
  );

  return (
    <ResourcesContainer
      key="ungrouped"
      nodeResources={nodeResources ?? []}
      resourceTypes={resourceTypes ?? []}
      currentNode={currentChildNode}
      contentMeta={keyedMetas}
      grouped={grouped === "grouped"}
      setCurrentNode={setCurrentNode}
      nodeResourcesIsPending={contentMetaIsPending || nodeResourcesIsPending}
      showQuality={showQuality}
      users={users}
    />
  );
};

export default memo(StructureResources);
