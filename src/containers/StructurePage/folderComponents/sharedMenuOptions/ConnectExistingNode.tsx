/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { CheckLine } from "@ndla/icons";
import { Text, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-taxonomy";
import NodeSearchDropdown from "./components/NodeSearchDropdown";
import { usePostNodeConnectionMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  currentNode: Node;
  nodeType: NodeType;
}

const StatusIndicatorContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const Wrapper = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    alignItems: "flex-start",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: { fill: "stroke.success" },
});

const ConnectExistingNode = ({ currentNode, nodeType }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: connectNode, isError, isPending, isSuccess } = usePostNodeConnectionMutation();
  const qc = useQueryClient();

  const handleSubmit = async (node: Node) => {
    await connectNode(
      {
        taxonomyVersion,
        body: { parentId: currentNode.id, childId: node.id },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: nodeQueryKeys.childNodes({
              taxonomyVersion,
              language: i18n.language,
            }),
          });
        },
      },
    );
  };
  return (
    <Wrapper>
      <NodeSearchDropdown
        label={t("taxonomy.connectExistingNode", {
          nodeType: t(`taxonomy.nodeType.${nodeType}`),
        })}
        placeholder={t("taxonomy.existingNode", { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
        onChange={handleSubmit}
        searchNodeType={nodeType}
        filter={(node) => {
          return !node.paths?.some((p) => {
            const split = p.replace("/", "").split("/");
            return split[split.length - 2] === currentNode.id.replace("urn:", "");
          });
        }}
      />
      <>
        {!!isPending && (
          <StatusIndicatorContent>
            <Spinner size="small" />
            <Text>{t("taxonomy.connectExistingLoading")}</Text>
          </StatusIndicatorContent>
        )}
        {!!isSuccess && (
          <StatusIndicatorContent>
            <StyledCheckLine />
            <Text>{t("taxonomy.connectExistingSuccess")}</Text>
          </StatusIndicatorContent>
        )}
        {!!isError && <Text color="text.error">{t("taxonomy.errorMessage")}</Text>}
      </>
    </Wrapper>
  );
};

export default ConnectExistingNode;
