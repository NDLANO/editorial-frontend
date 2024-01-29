/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import keyBy from "lodash/keyBy";
import { memo, RefObject } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import ResourcesContainer from "./ResourcesContainer";
import {
  NodeResourceMeta,
  useNodeResourceMetas,
  useResourcesWithNodeConnection,
} from "../../../modules/nodes/nodeQueries";
import { useAllResourceTypes } from "../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const StickyContainer = styled.div`
  position: sticky;
  top: ${spacing.small};
`;

export interface ResourceWithNodeConnectionAndMeta extends NodeChild {
  contentMeta?: NodeResourceMeta;
}

interface Props {
  currentChildNode: NodeChild;
  resourceRef: RefObject<HTMLDivElement>;
  setCurrentNode: (changedNode: NodeChild) => void;
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

const StructureResources = ({ currentChildNode, resourceRef, setCurrentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const grouped = currentChildNode?.metadata?.customFields["topic-resources"] ?? "grouped";

  const { data: nodeResources } = useResourcesWithNodeConnection(
    {
      id: currentChildNode.id,
      language: i18n.language,
      includeContexts: true,
      filterProgrammes: true,
      taxonomyVersion,
    },
    {
      select: (resources) => resources.map((r) => (r.resourceTypes.length > 0 ? r : withMissing(r))),
      placeholderData: [],
    },
  );

  const { data: nodeResourceMetas, isLoading: contentMetaLoading } = useNodeResourceMetas(
    {
      nodeId: currentChildNode.id,
      ids:
        nodeResources
          ?.map((r) => r.contentUri)
          .concat(currentChildNode.contentUri)
          .filter<string>((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    },
    { enabled: !!currentChildNode.contentUri || !!nodeResources?.length },
  );

  const keyedMetas = keyBy(nodeResourceMetas, (m) => m.contentUri);

  const { data: resourceTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: (resourceTypes) => resourceTypes.concat(getMissingResourceType(t)),
    },
  );

  return (
    <StickyContainer ref={resourceRef}>
      <ResourcesContainer
        key="ungrouped"
        nodeResources={nodeResources ?? []}
        resourceTypes={resourceTypes ?? []}
        currentNode={currentChildNode}
        contentMeta={keyedMetas}
        grouped={grouped === "grouped"}
        setCurrentNode={setCurrentNode}
        contentMetaLoading={contentMetaLoading}
      />
    </StickyContainer>
  );
};

export default memo(StructureResources);
