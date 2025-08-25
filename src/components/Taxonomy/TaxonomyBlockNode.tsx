/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine, SubtractLine } from "@ndla/icons";
import { Text, Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import Fade from "./Fade";
import { iconRecipe, NodeItemRoot, NodeItemTitle, ToggleIcon } from "./NodeItem";
import { MinimalNodeChild } from "./types";
import { NodeChildWithChildren, NodeWithChildren } from "../../modules/nodes/nodeApiTypes";

const StyledStructureItem = styled("div", {
  base: {
    width: "100%",
  },
});

const Wrapper = styled("div", {
  base: {
    marginInlineStart: "auto",
  },
});

const StyledUl = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: {
    fill: "surface.success",
  },
});

const StatusIndicatorContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledButton = styled(Button, {
  base: {
    opacity: "0",
  },
});

const StyledNodeItemRoot = styled(NodeItemRoot, {
  base: {
    _hover: {
      "& [data-select-button]": { opacity: "1" },
    },
  },
});

interface Props {
  node: NodeWithChildren;
  onSelect: (node: NodeChild) => void;
  onRootSelected?: (node: Node) => void;
  selectedNodes: MinimalNodeChild[] | Node[];
  getSubjectTopics: (subjectId: string) => Promise<void>;
}

export const TaxonomyBlockNode = ({ node, onSelect, selectedNodes, onRootSelected, getSubjectTopics }: Props) => {
  const { t } = useTranslation();
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(() => openedPaths[openedPaths.length - 1] === node.id, [openedPaths, node.id]);

  const isSelected = useMemo(() => {
    return selectedNodes.some((sel) => sel.id === node.id);
  }, [selectedNodes, node]);

  const toggleOpen = ({ id }: Node) => {
    let paths = [...openedPaths];
    const index = paths.indexOf(id);
    const isSubject = id.includes("subject");
    if (index === -1) {
      if (isSubject) {
        getSubjectTopics(id);
        paths = [];
      }
      paths.push(id);
    } else {
      paths.splice(index, 1);
    }
    setOpenedPaths(paths);
  };

  return (
    <StyledStructureItem key={node.path}>
      <StyledNodeItemRoot active={isActive} visible={node.metadata.visible}>
        <NodeItemTitle asChild consumeCss>
          <button onClick={() => toggleOpen(node)} type="button">
            <ToggleIcon hasChildNodes={true} isOpen={isOpen} />
            {node.name}
          </button>
        </NodeItemTitle>
        <Wrapper>
          {isSelected ? (
            <StatusIndicatorContent>
              <StyledCheckLine />
              <Text>{t("taxonomy.topics.addedTopic")}</Text>
            </StatusIndicatorContent>
          ) : onRootSelected ? (
            <StyledButton data-select-button="" variant="secondary" size="small" onClick={() => onRootSelected(node)}>
              {t("taxonomy.topics.filestructureButton")}
            </StyledButton>
          ) : null}
        </Wrapper>
      </StyledNodeItemRoot>
      {!!isOpen && !!node.childNodes && (
        <Fade show>
          <StyledUl>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
                level={1}
              />
            ))}
          </StyledUl>
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
  level?: number;
}

const ChildNode = ({ node, onSelect, toggleOpen, openedPaths, selectedNodes, level = 0 }: NodeItemProps) => {
  const { t } = useTranslation();
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(() => openedPaths[openedPaths.length - 1] === node.id, [openedPaths, node.id]);

  const isSelected = useMemo(() => {
    return selectedNodes.some((selected) => selected.id === node.id);
  }, [selectedNodes, node]);

  const onSelected = useCallback(() => onSelect(node), [node, onSelect]);
  return (
    <StyledStructureItem key={node.path}>
      <StyledNodeItemRoot
        active={isActive}
        visible={node.metadata.visible}
        style={{ "--level": level } as CSSProperties}
      >
        <NodeItemTitle asChild consumeCss>
          <button onClick={() => toggleOpen(node)} type="button">
            {node.childNodes?.length ? (
              <ToggleIcon hasChildNodes={true} isOpen={isOpen} />
            ) : (
              <SubtractLine css={iconRecipe.raw()} />
            )}
            {node.name}
          </button>
        </NodeItemTitle>
        <Wrapper>
          {isSelected ? (
            <StatusIndicatorContent>
              <StyledCheckLine />
              <Text>{t("taxonomy.topics.addedTopic")}</Text>
            </StatusIndicatorContent>
          ) : (
            <StyledButton data-select-button="" variant="secondary" size="small" onClick={onSelected}>
              {t("taxonomy.topics.filestructureButton")}
            </StyledButton>
          )}
        </Wrapper>
      </StyledNodeItemRoot>
      {!!isOpen && !!node.childNodes && (
        <Fade show>
          <StyledUl>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
                level={level + 1}
              />
            ))}
          </StyledUl>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default TaxonomyBlockNode;
