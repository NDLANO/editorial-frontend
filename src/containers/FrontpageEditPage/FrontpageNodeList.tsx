/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrayHelpers, FieldArray, FieldArrayRenderProps, useField } from "formik";
import { ComponentType, CSSProperties, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import { AddLine, ArrowRightShortLine, DeleteBinLine, Draggable } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleSummaryV2DTO } from "@ndla/types-backend/article-api";
import FrontpageArticleSearch from "./FrontpageArticleSearch";
import { MenuWithArticle } from "./types";
import DndList from "../../components/DndList";
import { DragHandle } from "../../components/DraggableItem";
import { toEditFrontPageArticle } from "../../util/routeHelpers";

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

const StyledNode = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    padding: "xsmall",
    background: "surface.default",
    borderBlockEnd: "1px solid",
    borderColor: "stroke.subtle",
    _hover: {
      background: "surface.hover",
    },
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    marginInlineStart: "large",
    _open: {
      "& svg": {
        transform: "rotate(90deg)",
      },
    },
  },
  variants: {
    isHidden: { true: { visibility: "hidden" } },
  },
});

const NodeWrapper = styled("div", {
  base: {
    width: "100%",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    marginInlineStart: "calc(var(--level) * token(spacing.large))",
  },
});

interface FrontpageNodeProps extends Pick<ArrayHelpers, "remove" | "replace"> {
  level: number;
  name: string;
  index: number;
}

const FrontpageNode = ({ name, remove, index, level, replace }: FrontpageNodeProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [field] = useField<MenuWithArticle>(name);
  const { t, i18n } = useTranslation();

  const onRemove = useCallback(() => remove(index), [index, remove]);

  const onAdd = useCallback(
    (val: ArticleSummaryV2DTO) => {
      const newMenu: MenuWithArticle = {
        articleId: val.id,
        article: val,
        menu: [],
      };
      const menu = field.value.menu.concat(newMenu);
      const updatedExisting: MenuWithArticle = {
        articleId: field.value.articleId,
        article: field.value.article,
        menu,
      };
      replace(index, updatedExisting);
    },
    [field.value, index, replace],
  );

  if (!field.value) {
    return null;
  }

  const openLabel = isOpen ? t("frontpageForm.openChildren") : t("frontpageForm.closeChildren");
  const hideToggleOpenButton = level >= FRONTPAGE_DEPTH_LIMIT || !field.value.menu.length;

  return (
    <NodeWrapper data-node-wrapper="">
      <StyledNode data-node="">
        <ContentWrapper style={{ "--level": level } as CSSProperties}>
          <StyledIconButton
            data-state={isOpen ? "open" : "closed"}
            size="small"
            variant="tertiary"
            aria-label={openLabel}
            title={openLabel}
            isHidden={hideToggleOpenButton}
            aria-hidden={hideToggleOpenButton}
            onClick={() => setIsOpen((p) => !p)}
          >
            <ArrowRightShortLine />
          </StyledIconButton>
          <SafeLink to={toEditFrontPageArticle(field.value.articleId, i18n.language)} target="_blank">
            {field.value.article?.title.title ?? t("frontpageForm.failedTitle")}
          </SafeLink>
        </ContentWrapper>
        <ContentWrapper>
          {!field.value.menu.length && (
            <IconButton
              aria-label={t("remove")}
              size="small"
              title={t("remove")}
              hidden={!!field.value.menu.length}
              variant="danger"
              onClick={onRemove}
            >
              <DeleteBinLine />
            </IconButton>
          )}
          <FrontpageArticleSearch onChange={onAdd}>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("frontpageForm.addArticle")}
              title={t("frontpageForm.addArticle")}
              disabled={level > FRONTPAGE_DEPTH_LIMIT - 1}
            >
              <AddLine />
            </IconButton>
          </FrontpageArticleSearch>
        </ContentWrapper>
      </StyledNode>
      {!!field.value.menu.length && !!isOpen && (
        <FieldArray name={`${name}.menu`} render={(props) => <FrontpageNodeList {...props} level={level + 1} />} />
      )}
    </NodeWrapper>
  );
};

export default FrontpageNodeList;
