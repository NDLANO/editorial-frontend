/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, fonts, spacing } from "@ndla/core";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import Fade from "./Fade";
import { ItemTitleButton, StructureWrapper, StyledItemBar, StyledStructureItem } from "./nodeStyles";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";
import { NodeChildWithChildren } from "../../modules/nodes/nodeQueries";

export interface NodeWithChildren extends Node {
  childNodes?: NodeChildWithChildren[];
}

const ItemBar = styled(StyledItemBar)`
  display: flex;
  justify-content: space-between;
  padding: 0 ${spacing.small};
  &:hover,
  &:active,
  &:focus-within {
    [data-select-button] {
      opacity: 1;
    }
  }
`;

const StyledStructureWrapper = styled(StructureWrapper)`
  padding-left: ${spacing.small};
`;

interface Props {
  node: NodeWithChildren;
  openedPaths: string[];
  toggleOpen: (node: Node) => void;
  onSelect: (node: NodeChild) => void;
  onRootSelected?: (node: NodeWithChildren) => void;
  selectedNodes: MinimalNodeChild[] | Node[];
}

export const TaxonomyBlockNode = ({
  node,
  toggleOpen,
  openedPaths,
  onSelect,
  selectedNodes,
  onRootSelected,
}: Props) => {
  const { t } = useTranslation();
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(() => openedPaths[openedPaths.length - 1] === node.id, [openedPaths, node.id]);

  const isSelected = useMemo(() => {
    return selectedNodes.some((sel) => sel.id === node.id);
  }, [selectedNodes, node]);

  const onClick = useCallback(() => toggleOpen(node), [node, toggleOpen]);

  return (
    <StyledStructureItem key={node.path}>
      <ItemBar highlight={isActive}>
        <ItemTitleButton
          type="button"
          hasChildNodes
          isRootNode={false}
          lastItemClickable
          isVisible={node.metadata.visible}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onClick}
        >
          {node.name}
        </ItemTitleButton>
        {isSelected ? (
          <StyledChecked>
            <CheckboxCircleFill />
            <span>{t("taxonomy.topics.addedTopic")}</span>
          </StyledChecked>
        ) : onRootSelected ? (
          <StyledButton data-select-button="" variant="secondary" size="small" onClick={() => onRootSelected(node)}>
            {t("taxonomy.topics.filestructureButton")}
          </StyledButton>
        ) : null}
      </ItemBar>
      {!!isOpen && !!node.childNodes && (
        <Fade show>
          <StyledStructureWrapper>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                parentActive={isActive}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
              />
            ))}
          </StyledStructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

interface NodeItemProps {
  node: NodeChildWithChildren;
  onSelect: (node: NodeChild) => void;
  toggleOpen: (node: Node) => void;
  openedPaths: string[];
  selectedNodes: MinimalNodeChild[] | Node[];
  parentActive: boolean;
}

const StyledChecked = styled.div`
  ${fonts.sizes(16, 1.1)}

  font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;

  svg {
    fill: ${colors.support.green};
  }
`;

const StyledButton = styled(Button)`
  opacity: 0;
`;

const ChildNode = ({ node, onSelect, toggleOpen, openedPaths, parentActive, selectedNodes }: NodeItemProps) => {
  const { t } = useTranslation();
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(() => openedPaths[openedPaths.length - 1] === node.id, [openedPaths, node.id]);

  const isSelected = useMemo(() => {
    return selectedNodes.some((sel) => sel.id === node.id);
  }, [selectedNodes, node]);

  const onClick = useCallback(() => toggleOpen(node), [node, toggleOpen]);

  const onSelected = useCallback(() => onSelect(node), [node, onSelect]);

  return (
    <StyledStructureItem key={node.path} greyedOut={!parentActive && !isActive}>
      <ItemBar highlight={isActive}>
        <ItemTitleButton
          type="button"
          hasChildNodes={!!node.childNodes?.length}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onClick}
          isVisible={node.metadata.visible}
        >
          {node.name}
        </ItemTitleButton>
        {isSelected ? (
          <StyledChecked>
            <CheckboxCircleFill />
            <span>{t("taxonomy.topics.addedTopic")}</span>
          </StyledChecked>
        ) : (
          <StyledButton data-select-button="" variant="secondary" size="small" onClick={onSelected}>
            {t("taxonomy.topics.filestructureButton")}
          </StyledButton>
        )}
      </ItemBar>
      {!!isOpen && !!node.childNodes && (
        <Fade show>
          <StyledStructureWrapper>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                parentActive={isActive}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
              />
            ))}
          </StyledStructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default TaxonomyBlockNode;
