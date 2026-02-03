/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Heading,
  Spinner,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-taxonomy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});
interface Props {
  node: Node;
  rootNodeId: string;
  rootNodeType?: NodeType;
}

const ToggleVisibility = ({ node, rootNodeId, rootNodeType = "SUBJECT" }: Props) => {
  const { t, i18n } = useTranslation();
  const { id, metadata } = node;
  const [visible, setVisible] = useState(metadata?.visible);

  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: updateMetadata, isPending } = useUpdateNodeMetadataMutation();

  const qc = useQueryClient();
  const compKey = nodeQueryKeys.nodes({
    language: i18n.language,
    nodeType: [rootNodeType],
    taxonomyVersion,
  });

  const toggleVisibility = async () => {
    await updateMetadata(
      {
        id,
        metadata: { grepCodes: metadata.grepCodes, visible: !visible },
        rootId: rootNodeId !== node.id ? rootNodeId : undefined,
        taxonomyVersion,
      },
      { onSuccess: () => qc.invalidateQueries({ queryKey: compKey }) },
    );
    setVisible(!visible);
  };

  return (
    <>
      <TitleWrapper>
        <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
          <h2>{t("metadata.changeVisibility")}</h2>
        </Heading>
        {!!isPending && <Spinner size="small" />}
      </TitleWrapper>
      <SwitchRoot checked={visible} onCheckedChange={toggleVisibility}>
        <SwitchLabel>{t("metadata.visible")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
    </>
  );
};

export default ToggleVisibility;
