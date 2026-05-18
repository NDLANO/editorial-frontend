/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { Node, Metadata } from "@ndla/types-backend/taxonomy-api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  node: Node;
  onChanged?: (newMeta: Partial<Metadata>) => void;
}

const GroupTopicResources = ({ node, onChanged }: Props) => {
  const { t, i18n } = useTranslation();
  const updateNodeMetadata = useUpdateNodeMetadataMutation();
  const qc = useQueryClient();
  const rootNodeId = getRootIdForNode(node);
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: rootNodeId,
    language: i18n.language,
  });
  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      numbered: node.metadata.customFields?.numbered === "true" ? "false" : "true",
    };
    updateNodeMetadata.mutate(
      {
        id: node.id,
        metadata: { customFields },
        rootId: isRootNode(node) ? undefined : rootNodeId,
        taxonomyVersion,
      },
      {
        onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
        onSuccess: () => onChanged?.({ customFields }),
      },
    );
  };

  const isNumbered = node.metadata?.customFields.numbered === "true";

  return (
    <SwitchRoot checked={isNumbered} onCheckedChange={updateMetadata}>
      <SwitchLabel>{t("taxonomy.metadata.customFields.numberedLabel")}</SwitchLabel>
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchHiddenInput />
    </SwitchRoot>
  );
};

export default GroupTopicResources;
