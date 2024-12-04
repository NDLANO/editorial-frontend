/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { BookOpenLine, FileListLine } from "@ndla/icons";
import { Node } from "@ndla/types-taxonomy";
import { DiffType } from "../containers/NodeDiff/diffUtils";
import { SUBJECT_NODE } from "../modules/nodes/nodeApiTypes";
import { getNodeTypeFromNodeId } from "../modules/nodes/nodeUtil";

interface Props {
  node: DiffType<Node> | Node;
}

const NodeIconType = ({ node }: Props) => {
  const { t } = useTranslation();
  const nodeType =
    typeof node.id === "string"
      ? getNodeTypeFromNodeId(node.id)
      : getNodeTypeFromNodeId(node.id.other ?? node.id.original!);

  const Icon = nodeType === SUBJECT_NODE ? BookOpenLine : FileListLine;

  return <Icon aria-label={t(`diff.nodeTypeTooltips.${nodeType}`)} title={t(`diff.nodeTypeTooltips.${nodeType}`)} />;
};

export default NodeIconType;
