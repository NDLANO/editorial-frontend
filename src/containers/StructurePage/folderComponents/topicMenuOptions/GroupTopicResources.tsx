/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { Node, Metadata } from "@ndla/types-backend/taxonomy-api";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { updateNodeMetadataMutationOptions } from "../../../../modules/nodes/nodeMutations";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  node: Node;
  onChanged?: (newMeta: Partial<Metadata>) => void;
}

const GroupTopicResources = ({ node, onChanged }: Props) => {
  const { t } = useTranslation();
  const updateNodeMetadata = useMutation(
    updateNodeMetadataMutationOptions({ rootId: isRootNode(node) ? undefined : getRootIdForNode(node) }),
  );
  const { taxonomyVersion } = useTaxonomyVersion();
  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      numbered: node.metadata.customFields?.numbered === "true" ? "false" : "true",
    };
    updateNodeMetadata.mutate(
      { id: node.id, meta: { customFields }, taxonomyVersion },
      { onSuccess: () => onChanged?.({ customFields }) },
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
