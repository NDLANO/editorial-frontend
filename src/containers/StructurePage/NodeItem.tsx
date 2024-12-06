/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, MutableRefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import {
  Draggable,
  StarLine,
  StarFill,
  ArrowRightShortLine,
  ArrowDownShortLine,
  BookmarkLine,
  CornerDownRightLine,
} from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, Node } from "@ndla/types-taxonomy";
import NodeControls from "./folderComponents/NodeControls";
import QualityEvaluationGrade from "./resourceComponents/QualityEvaluationGrade";
import DndList from "../../components/DndList";
import { DragHandle } from "../../components/DraggableItem";
import Fade from "../../components/Taxonomy/Fade";
import { TAXONOMY_ADMIN_SCOPE } from "../../constants";
import { NodeChildWithChildren } from "../../modules/nodes/nodeQueries";
import { nodePathToUrnPath } from "../../util/taxonomyHelpers";
import { useSession } from "../Session/SessionProvider";
import StructureErrorIcon from "./folderComponents/StructureErrorIcon";
import { removeLastItemFromUrl } from "../../util/routeHelpers";

const QualityEvaluationWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    textStyle: "label.medium",
    color: "text.default",
    textDecoration: "none",
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
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
    visible: {
      false: {
        color: "text.subtle",
      },
    },
  },
});

const StyledStructureItem = styled("div", {
  base: {
    width: "100%",
  },
  variants: {
    root: { true: { overflowX: "auto" } },
  },
});

const StyledItemBar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xxsmall",
    paddingBlock: "3xsmall",
    paddingInline: "4xsmall",
    paddingInlineStart: "calc(var(--level) * token(spacing.large))",
  },
  variants: {
    active: {
      true: {
        background: "surface.brand.2.moderate",
      },
      false: {
        _hover: {
          background: "surface.hover",
        },
      },
    },
  },
});

const StyledIconButton = styled(IconButton, {
  variants: {
    isHidden: { true: { visibility: "hidden" } },
  },
});

const StyledDragHandle = styled(DragHandle, {
  base: {
    position: "absolute",
    marginInlineStart: "3xsmall",
    left: "calc(var(--level) * token(spacing.large))",
  },
});

export const iconRecipe = cva({
  base: {
    fill: "icon.default",
  },
});

const StyledUl = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const getPath = (path: string, rootPath: string): string => {
  const currentPath = location.pathname.replace(rootPath, "");
  const levelAbove = removeLastItemFromUrl(currentPath);
  const newPath = currentPath === path ? levelAbove : path;
  return `${rootPath}${newPath}`;
};

interface Props {
  id: string;
  item: (NodeChild & { articleType?: string; isPublished?: boolean }) | Node;
  openedPaths: string[];
  onNodeSelected: (node?: Node) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  rootNodeId: string;
  onDragEnd: (result: DragEndEvent, childNodes: NodeChild[]) => Promise<void>;
  connectionId: string;
  isRoot?: boolean;
  isFavorite: boolean;
  toggleFavorite?: () => void;
  nodes?: NodeChildWithChildren[];
  isLoading?: boolean;
  showQuality: boolean;
  prevLevel?: number;
  rootPath: string;
}

const NodeItem = ({
  item,
  openedPaths,
  onNodeSelected,
  rootNodeId,
  resourceSectionRef,
  onDragEnd,
  isRoot,
  isFavorite,
  toggleFavorite,
  isLoading,
  nodes = [],
  showQuality,
  prevLevel = 0,
  rootPath,
}: Props) => {
  const [level, _] = useState(isRoot ? 0 : prevLevel + 1);
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) || false;
  const path = nodePathToUrnPath(item.path) ?? "";
  const isOpen = openedPaths.includes(path);
  const isActive = openedPaths[openedPaths.length - 1] === path;
  const hasChildNodes = isRoot ? true : nodes.length > 0;

  useEffect(() => {
    if (isActive) {
      onNodeSelected(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const newPath = getPath(path, rootPath);

  return (
    <StyledStructureItem id={item.id} key={path} root={!!isRoot} data-testid="structure-node-item">
      <StyledItemBar active={isActive} style={{ "--level": level } as CSSProperties}>
        <StyledIconButton
          variant="clear"
          size="small"
          onClick={toggleFavorite}
          aria-label={isFavorite ? t("taxonomy.favorite.remove") : t("taxonomy.favorite.add")}
          title={isFavorite ? t("taxonomy.favorite.remove") : t("taxonomy.favorite.add")}
          data-testid="favourite-subject"
          isHidden={!isRoot}
        >
          {isFavorite ? <StarFill /> : <StarLine />}
        </StyledIconButton>
        <StyledSafeLink to={newPath} onClick={() => onNodeSelected(item)} visible={item.metadata?.visible}>
          {hasChildNodes ? (
            isOpen ? (
              <ArrowDownShortLine css={iconRecipe.raw()} />
            ) : (
              <ArrowRightShortLine css={iconRecipe.raw()} />
            )
          ) : null}
          {!hasChildNodes && <CornerDownRightLine css={iconRecipe.raw()} />}
          {item.nodeType === "TOPIC" && (
            <BookmarkLine
              aria-label={t("taxonomy.nodeType.TOPIC")}
              title={t("topicArticleForm.title")}
              css={iconRecipe.raw()}
            />
          )}
          {item.name}
        </StyledSafeLink>
        <StructureErrorIcon node={item} isRoot={!!isRoot} isTaxonomyAdmin={isTaxonomyAdmin} />
        {!!showQuality && (item.nodeType === "TOPIC" || item.nodeType === "SUBJECT") && (
          <QualityEvaluationWrapper>
            <QualityEvaluationGrade
              grade={item.gradeAverage?.averageValue}
              averageGrade={item.gradeAverage?.averageValue.toFixed(1)}
              tooltip={t("taxonomy.qualityDescription", {
                nodeType: t(`taxonomy.${item.nodeType}`),
                count: item.gradeAverage?.count,
              })}
            />
            <QualityEvaluationGrade
              grade={item.qualityEvaluation?.grade}
              tooltip={`${t("taxonomy.qualityEvaluation", { nodeType: t(`taxonomy.${item.nodeType}`) })}${
                item?.qualityEvaluation?.note ? `: ${item.qualityEvaluation.note}` : ""
              }`}
            />
          </QualityEvaluationWrapper>
        )}
        {!!isActive && (
          <NodeControls
            node={item}
            rootNodeId={rootNodeId}
            key={item.id}
            isMainActive={isOpen}
            onCurrentNodeChanged={(node) => onNodeSelected(node)}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
            nodeChildren={nodes}
            isLoading={!!isLoading}
          />
        )}
      </StyledItemBar>
      {!!hasChildNodes && !!isOpen && !!nodes && (
        <Fade show={true}>
          <StyledUl>
            <DndList
              items={nodes}
              disabled={!isActive || nodes.length < 2}
              onDragEnd={(e) => onDragEnd(e, nodes)}
              renderItem={(t) => (
                <NodeItem
                  isFavorite={false}
                  key={`${path}/${t.id}`}
                  connectionId={t.connectionId}
                  id={t.id}
                  rootNodeId={rootNodeId}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  onNodeSelected={onNodeSelected}
                  item={t}
                  nodes={t.childNodes}
                  onDragEnd={onDragEnd}
                  showQuality={showQuality}
                  prevLevel={level}
                  rootPath={rootPath}
                />
              )}
              dragHandle={
                <StyledDragHandle
                  aria-label={t("dragAndDrop.handle")}
                  size="small"
                  style={{ "--level": level + 1 } as CSSProperties}
                >
                  <Draggable />
                </StyledDragHandle>
              }
            />
          </StyledUl>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default NodeItem;
