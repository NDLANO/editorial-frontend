/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArrayRenderProps, useField } from "formik";
import { ComponentType, CSSProperties, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";
import FrontpageNode from "./FrontpageNode";
import { MenuWithArticle } from "./types";
import DndList from "../../components/DndList";
import { DragHandle } from "../../components/DraggableItem";

interface Props extends FieldArrayRenderProps {
  level: number;
}

export const FRONTPAGE_DEPTH_LIMIT = 3;

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledDragHandle = styled(DragHandle, {
  base: {
    alignSelf: "flex-start",
    paddingBlock: "0",
    paddingInline: "0",
    position: "absolute",
    marginBlockStart: "4xsmall",
    marginInlineStart: "calc(var(--level) * token(spacing.large))",
    _hover: {
      "& ~ [data-node-wrapper] > [data-node]": {
        background: "surface.hover",
      },
    },
    _active: {
      "& ~ [data-node-wrapper] > [data-node]": {
        background: "surface.hover",
      },
    },
  },
});

const FrontpageNodeList: ComponentType<Props> = ({ name, replace, remove, level, move }: Props) => {
  const { t } = useTranslation();
  const [menuField] = useField<MenuWithArticle[]>(name);

  const sortableItems = useMemo(
    () => menuField.value.map((menu) => ({ ...menu, id: menu.articleId })),
    [menuField.value],
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.data.current?.index !== undefined && over?.data.current?.index !== undefined) {
        move(active!.data!.current!.index!, over!.data.current!.index!);
      }
    },
    [move],
  );

  return (
    <StyledList>
      <DndList
        items={sortableItems}
        disabled={menuField.value.length < FRONTPAGE_DEPTH_LIMIT}
        onDragEnd={onDragEnd}
        dragHandle={
          <StyledDragHandle aria-label={t("dragAndDrop.handle")} style={{ "--level": level } as CSSProperties}>
            <Draggable />
          </StyledDragHandle>
        }
        renderItem={(_, index) => (
          <FrontpageNode
            key={index}
            name={`${name}.${index}`}
            remove={remove}
            replace={replace}
            index={index}
            level={level}
          />
        )}
      />
    </StyledList>
  );
};

export default FrontpageNodeList;
