/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { Node, Metadata } from "@ndla/types-taxonomy";
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from "../../../constants";
import { useUpdateNodeMetadataMutation } from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { getRootIdForNode, isRootNode } from "../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  node: Node;
  onChanged: (newMeta: Partial<Metadata>) => void;
}

const isGrouped = (node: Node): boolean =>
  node.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE;

const GroupResourceSwitch = ({ node, onChanged }: Props) => {
  const grouped = useMemo(() => isGrouped(node), [node]);
  const { t, i18n } = useTranslation();

  const updateNodeMetadata = useUpdateNodeMetadataMutation();
  const rootNodeId = getRootIdForNode(node);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const compKey = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: rootNodeId,
    language: i18n.language,
  });

  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: grouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
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
        onSuccess: () => onChanged({ customFields }),
      },
    );
  };

  return (
    <SwitchRoot
      checked={grouped}
      onCheckedChange={updateMetadata}
      title={t("taxonomy.metadata.customFields.RGTooltip")}
    >
      <SwitchLabel srOnly>{t("taxonomy.metadata.customFields.RGTooltip")}</SwitchLabel>
      <SwitchControl>
        <SwitchThumb>{grouped ? "G" : "U"}</SwitchThumb>
      </SwitchControl>
      <SwitchHiddenInput />
    </SwitchRoot>
  );
};

export default GroupResourceSwitch;
