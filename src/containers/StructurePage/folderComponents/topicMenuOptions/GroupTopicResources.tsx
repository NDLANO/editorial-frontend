/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { Node, Metadata } from "@ndla/types-taxonomy";
import RoundIcon from "../../../../components/RoundIcon";
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from "../../../../constants";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { StyledMenuItemEditField } from "../styles";

interface Props {
  node: Node;
  hideIcon?: boolean;
  onChanged?: (newMeta: Partial<Metadata>) => void;
}

const GroupTopicResources = ({ node, hideIcon, onChanged }: Props) => {
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
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
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
        onSuccess: () => onChanged?.({ customFields }),
      },
    );
  };

  const nodeResources = node.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];
  const isGrouped =
    (nodeResources ?? TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE) === TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE;
  return (
    <StyledMenuItemEditField>
      {hideIcon || <RoundIcon open small />}
      <SwitchRoot
        checked={isGrouped}
        onCheckedChange={updateMetadata}
        title={t("taxonomy.metadata.customFields.RGTooltip")}
        aria-label={t("taxonomy.metadata.customFields.RGTooltip")}
      >
        <SwitchLabel>{t("taxonomy.metadata.customFields.resourceGroupPlaceholder")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb>{isGrouped ? "G" : "U"}</SwitchThumb>
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
    </StyledMenuItemEditField>
  );
};

export default GroupTopicResources;
