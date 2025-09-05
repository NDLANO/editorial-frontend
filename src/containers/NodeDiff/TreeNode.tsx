/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { ArrowDownShortLine, SubtractLine } from "@ndla/icons";
import { Badge, BadgeVariant } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { DiffResultType, DiffTree, DiffType, DiffTypeWithChildren, removeUnchangedFromTree } from "./diffUtils";
import Fade from "../../components/Taxonomy/Fade";
import { NodeItemRoot, NodeItemTitle } from "../../components/Taxonomy/NodeItem";
import { nodePathToUrnPath } from "../../util/taxonomyHelpers";

const StyledStructureItem = styled("div", {
  base: {
    width: "100%",
  },
});

const StyledUl = styled("ul", {
  base: { listStyle: "none" },
});

interface RootNodeProps {
  tree: DiffTree;
  onNodeSelected: (node?: DiffType<Node>) => void;
  selectedNode?: DiffType<Node> | DiffTypeWithChildren;
}

export const RootNode = ({ tree, onNodeSelected, selectedNode }: RootNodeProps) => {
  const root = tree.root;
  const [params] = useSearchParams();

  const nodeView = params.get("nodeView") ?? "changed";
  if (
    root.changed.diffType === "NONE" &&
    root.childrenChanged?.diffType === "NONE" &&
    root.resourcesChanged?.diffType === "NONE" &&
    nodeView === "changed"
  )
    return null;
  const children = nodeView === "changed" ? removeUnchangedFromTree(tree.children) : tree.children;

  return <TreeNode selectedNode={selectedNode} node={root} nodes={children} onNodeSelected={onNodeSelected} />;
};

const DiffPills = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    marginInlineStart: "auto",
  },
});

interface DiffTypePillProps {
  diffType: DiffResultType;
}

const diffTypeToColorTheme: Record<DiffResultType, BadgeVariant> = {
  NONE: "neutral",
  MODIFIED: "warning",
  ADDED: "success",
  DELETED: "danger",
};

export const DiffTypePill = ({ diffType }: DiffTypePillProps) => {
  const { t } = useTranslation();
  if (diffType === "NONE") return null;
  return <Badge colorTheme={diffTypeToColorTheme[diffType]}>{t(`diff.diffTypes.${diffType}`)}</Badge>;
};

interface Props {
  node: DiffType<Node> | DiffTypeWithChildren;
  onNodeSelected: (node?: DiffType<Node>) => void;
  selectedNode?: DiffType<Node> | DiffTypeWithChildren;
  nodes?: DiffTypeWithChildren[];
  level?: number;
}

export const TreeNode = ({ node, onNodeSelected, selectedNode, nodes, level = 0 }: Props) => {
  const { t } = useTranslation();
  const path = nodePathToUrnPath(node.path?.other ?? node.path?.original);
  const isActive = (selectedNode?.id.other ?? selectedNode?.id.original) === (node.id.other ?? node.id.original);
  const hasChildNodes = nodes && nodes.length > 0;
  const isVisible = node.metadata?.visible.other ?? node.metadata?.visible.original;

  const onItemClick = () => {
    onNodeSelected(node);
  };

  return (
    <StyledStructureItem id={node.id.other ?? node.id.original} key={path}>
      <NodeItemRoot active={isActive} visible={isVisible} style={{ "--level": level } as CSSProperties}>
        <NodeItemTitle asChild consumeCss>
          <button onClick={onItemClick} type="button">
            {hasChildNodes ? <ArrowDownShortLine /> : <SubtractLine />}
            {node.name.other ?? node.name.original}
          </button>
        </NodeItemTitle>
        <DiffPills>
          {!!node.resourcesChanged &&
            node.resourcesChanged?.diffType !== "NONE" &&
            node.changed.diffType !== "DELETED" &&
            node.changed.diffType !== "ADDED" && <Badge colorTheme="brand2">{t("diff.resourcesChanged")}</Badge>}
          {!!node.childrenChanged && node.childrenChanged?.diffType !== "NONE" && (
            <Badge colorTheme="neutral">{t("diff.childrenChanged")}</Badge>
          )}
          {node.changed.diffType !== "NONE" && <DiffTypePill diffType={node.changed.diffType} />}
        </DiffPills>
      </NodeItemRoot>
      {!!hasChildNodes &&
        nodes?.map((node) => (
          <StyledUl key={`${path}/${node.id.other ?? node.id.original}`}>
            <Fade show={true}>
              <TreeNode
                key={`${path}/${node.id.other ?? node.id.original}`}
                onNodeSelected={onNodeSelected}
                node={node}
                nodes={node.children}
                selectedNode={selectedNode}
                level={level + 1}
              />
            </Fade>
          </StyledUl>
        ))}
    </StyledStructureItem>
  );
};
