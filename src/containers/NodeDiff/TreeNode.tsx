/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ArrowDownShortLine, CornerDownRightLine } from "@ndla/icons";
import { Text, Badge, BadgeVariant } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { DiffResultType, DiffTree, DiffType, DiffTypeWithChildren, removeUnchangedFromTree } from "./diffUtils";
import Fade from "../../components/Taxonomy/Fade";
import { StructureWrapper } from "../../components/Taxonomy/nodeStyles";
import { nodePathToUrnPath } from "../../util/taxonomyHelpers";
import { StyledItemBar } from "../StructurePage/NodeItem";

const StyledStructureItem = styled("div", {
  base: {
    width: "100%",
  },
});

const StyledButton = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
    cursor: "pointer",
  },
});

const StyledText = styled(Text, {
  base: {
    _hover: {
      textDecoration: "underline",
    },
  },
  variants: {
    active: {
      true: {
        textDecoration: "underline",
      },
    },
  },
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

  return (
    <TreeNode selectedNode={selectedNode} node={root} nodes={children} onNodeSelected={onNodeSelected} isRoot={true} />
  );
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
  isRoot?: boolean;
  prevLevel?: number;
}

export const TreeNode = ({ node, onNodeSelected, selectedNode, nodes, isRoot, prevLevel = 0 }: Props) => {
  const { t } = useTranslation();
  const [level, _] = useState(isRoot ? 0 : prevLevel + 1);
  const path = nodePathToUrnPath(node.path?.other ?? node.path?.original);
  const isActive = (selectedNode?.id.other ?? selectedNode?.id.original) === (node.id.other ?? node.id.original);
  const hasChildNodes = nodes && nodes.length > 0;
  const isVisible = node.metadata?.visible.other ?? node.metadata?.visible.original;

  const onItemClick = () => {
    onNodeSelected(node);
  };

  return (
    <StyledStructureItem id={node.id.other ?? node.id.original} key={path}>
      <StyledItemBar active={isActive} style={{ "--level": level } as CSSProperties}>
        <StyledButton type="button" id={node.id.other ?? node.id.original} onClick={onItemClick}>
          {hasChildNodes ? <ArrowDownShortLine /> : <CornerDownRightLine />}
          <StyledText color={isVisible ? "text.default" : "text.subtle"} active={isActive}>
            {node.name.other ?? node.name.original}
          </StyledText>
        </StyledButton>
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
      </StyledItemBar>
      {!!hasChildNodes &&
        nodes?.map((node) => (
          <StructureWrapper key={`${path}/${node.id.other ?? node.id.original}`}>
            <Fade show={true}>
              <TreeNode
                key={`${path}/${node.id.other ?? node.id.original}`}
                onNodeSelected={onNodeSelected}
                node={node}
                nodes={node.children}
                selectedNode={selectedNode}
                prevLevel={level}
              />
            </Fade>
          </StructureWrapper>
        ))}
    </StyledStructureItem>
  );
};
