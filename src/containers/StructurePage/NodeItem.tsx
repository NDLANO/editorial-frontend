/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLProps, MutableRefObject, ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Subject } from "@ndla/icons/contentType";
import { DragVertical, Star, SubjectMatter, Taxonomy } from "@ndla/icons/editor";
import { NodeChild, Node, NodeType } from "@ndla/types-taxonomy";
import FolderItem from "./folderComponents/FolderItem";
import QualityEvaluationGrade from "./resourceComponents/QualityEvaluationGrade";
import DndList from "../../components/DndList";
import { DragHandle } from "../../components/DraggableItem";
import { OldSpinner } from "../../components/OldSpinner";
import Fade from "../../components/Taxonomy/Fade";
import {
  ItemTitleButton,
  StructureWrapper,
  StyledIcon,
  StyledItemBar,
  StyledStructureItem,
} from "../../components/Taxonomy/nodeStyles";
import { TAXONOMY_ADMIN_SCOPE } from "../../constants";
import { NodeChildWithChildren } from "../../modules/nodes/nodeQueries";
import { createGuard } from "../../util/guards";
import { nodePathToUrnPath } from "../../util/taxonomyHelpers";
import { useSession } from "../Session/SessionProvider";

export type RenderBeforeFunction = (
  node: NodeChild | Node,
  isRoot: boolean,
  isTaxonomyAdmin: boolean,
  articleType?: string,
  isPublished?: boolean,
) => ReactNode;

interface RoundIconProps {
  smallIcon: ReactNode;
  clicked?: boolean;
  type?: "button" | "reset" | "submit";
}

const StyledStar = styled(Star)`
  color: ${colors.brand.greyDark};
  &[data-favorite="true"] {
    color: ${colors.favoriteColor};
  }
`;

const RoundIcon = ({ smallIcon, ...rest }: RoundIconProps & Omit<HTMLProps<HTMLButtonElement>, "as">) => (
  <StyledIcon {...rest}>{smallIcon}</StyledIcon>
);

const StyledSpinner = styled(OldSpinner)`
  margin: 4px ${spacing.normal};
`;

const IconWrapper = styled.div`
  padding: 0 ${spacing.xxsmall};
  display: flex;
  align-items: center;
  svg {
    height: ${spacing.nsmall};
    width: ${spacing.nsmall};
    fill: ${colors.text.primary};
  }
  &[data-color="green"] {
    svg {
      fill: ${colors.support.green};
    }
  }
`;

const EvaluationWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
`;

const isChildNode = createGuard<NodeChild & { articleType?: string; isPublished?: boolean }>("connectionId");

const getNodeIcon = (nodeType: NodeType): { icon: ReactNode; title: string } => {
  switch (nodeType) {
    case "SUBJECT":
      return {
        icon: <SubjectMatter />,
        title: "subjectpageForm.title",
      };
    case "PROGRAMME":
      return {
        icon: <Taxonomy />,
        title: "programmepageForm.title",
      };
    default:
      return {
        icon: <Subject />,
        title: "topicArticleForm.title",
      };
  }
};
interface Props {
  id: string;
  item: (NodeChild & { articleType?: string; isPublished?: boolean }) | Node;
  openedPaths: string[];
  toggleOpen: (nodeId: string) => void;
  onNodeSelected: (node?: Node) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  rootNodeId: string;
  onDragEnd: (result: DragEndEvent, childNodes: NodeChild[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  isRoot?: boolean;
  isFavorite: boolean;
  toggleFavorite?: () => void;
  nodes?: NodeChildWithChildren[];
  isLoading?: boolean;
  renderBeforeTitle?: RenderBeforeFunction;
  addChildTooltip?: string;
  showQuality: boolean;
}

const NodeItem = ({
  item,
  openedPaths,
  toggleOpen,
  onNodeSelected,
  rootNodeId,
  resourceSectionRef,
  onDragEnd,
  parentActive,
  isRoot,
  isFavorite,
  toggleFavorite,
  isLoading,
  nodes,
  renderBeforeTitle,
  addChildTooltip,
  showQuality,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) || false;
  const path = nodePathToUrnPath(item.path) ?? "";
  const isOpen = openedPaths.includes(path);
  const isActive = openedPaths[openedPaths.length - 1] === path;
  const hasChildNodes = isRoot ? true : nodes && nodes.length > 0;
  const connectionId = isChildNode(item) ? item.connectionId : undefined;
  const articleType = isChildNode(item) ? item.articleType : undefined;
  const isPublished = isChildNode(item) ? item.isPublished : undefined;

  useEffect(() => {
    if (isActive) {
      onNodeSelected(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onItemClick = () => {
    toggleOpen(path);
    onNodeSelected(item);
  };

  const nodeTypeIcon = useMemo(() => getNodeIcon(item.nodeType), [item.nodeType]);

  return (
    <StyledStructureItem connectionId={connectionId} id={item.id} key={path} greyedOut={!parentActive && !isActive}>
      <StyledItemBar highlight={isActive}>
        {isRoot && (
          <RoundIcon
            onClick={toggleFavorite}
            smallIcon={<StyledStar data-favorite={isFavorite} data-testid="star-icon" />}
            data-testid="favourite-subject"
          />
        )}
        <ItemTitleButton
          type="button"
          id={item.id}
          hasChildNodes={hasChildNodes}
          isRootNode={false}
          lastItemClickable={true}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onItemClick}
          isVisible={item.metadata?.visible}
        >
          {renderBeforeTitle?.(item, !!isRoot, isTaxonomyAdmin, articleType, isPublished)}
          <IconWrapper title={t(nodeTypeIcon.title)} aria-label={t(nodeTypeIcon.title)}>
            {nodeTypeIcon.icon}
          </IconWrapper>
          {item.name}
        </ItemTitleButton>
        {showQuality && (item.nodeType === "TOPIC" || item.nodeType === "SUBJECT") && (
          <EvaluationWrapper>
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
          </EvaluationWrapper>
        )}
        {isActive && (
          <FolderItem
            node={item}
            rootNodeId={rootNodeId}
            key={item.id}
            isMainActive={isOpen}
            onCurrentNodeChanged={(node) => onNodeSelected(node)}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
            nodeChildren={nodes ?? []}
            addChildTooltip={addChildTooltip}
          />
        )}
        {isLoading && (
          <span>
            <StyledSpinner size="normal" />
          </span>
        )}
      </StyledItemBar>
      {hasChildNodes && isOpen && nodes && (
        <Fade show={true}>
          <StructureWrapper>
            <DndList
              items={nodes}
              disabled={!isActive || nodes.length < 2}
              onDragEnd={(e) => onDragEnd(e, nodes)}
              renderItem={(t) => (
                <NodeItem
                  isFavorite={false}
                  renderBeforeTitle={renderBeforeTitle}
                  key={`${path}/${t.id}`}
                  parentActive={isActive}
                  connectionId={t.connectionId}
                  id={t.id}
                  rootNodeId={rootNodeId}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  onNodeSelected={onNodeSelected}
                  item={t}
                  nodes={t.childNodes}
                  toggleOpen={toggleOpen}
                  onDragEnd={onDragEnd}
                  addChildTooltip={addChildTooltip}
                  showQuality={showQuality}
                />
              )}
              dragHandle={
                <DragHandle aria-label={t("dragAndDrop.handle")}>
                  <DragVertical />
                </DragHandle>
              }
            />
          </StructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default NodeItem;
