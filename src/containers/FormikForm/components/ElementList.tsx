/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { DragVertical } from "@ndla/icons/editor";
import { IRelatedContentLink } from "@ndla/types-backend/draft-api";
import ListElementCard from "./ListElementCard";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";

const StyledWrapper = styled.ul`
  margin: ${spacing.normal} 0;
  padding: 0;
`;

export interface ElementType {
  id: number;
  articleType?: string;
  metaImage?: { alt?: string; url?: string };
  title?: { title: string; language: string };
  supportedLanguages?: string[];
  contexts?: { contextType: string }[];
}

export type ExternalElementType = IRelatedContentLink & { isExternal?: boolean };
export type ListElement = ElementType | ExternalElementType;

interface Props {
  elements: ListElement[];
  articleType?: string;
  isDeletable?: boolean;
  isDraggable?: boolean;
  messages?: {
    removeElement: string;
    dragElement: string;
  };
  onUpdateElements?: Function;
}

const ElementList = ({
  elements = [],
  articleType,
  isDeletable = true,
  isDraggable = true,
  messages,
  onUpdateElements,
}: Props) => {
  const { t } = useTranslation();

  const onDeleteFile = (deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements?.(newElements);
  };

  return (
    <StyledWrapper>
      {isDraggable ? (
        <DndList
          items={elements.map((element, index) => ({ ...element, id: index + 1 }))}
          dragHandle={
            <DragHandle aria-label={messages?.dragElement ?? t("dragAndDrop.handle")}>
              <DragVertical />
            </DragHandle>
          }
          renderItem={(item, index) => (
            <ListElementCard
              key={item.id}
              element={item}
              onDelete={onDeleteFile}
              index={index}
              articleType={articleType}
              removeElementTranslation={messages?.removeElement}
              isDeletable={isDeletable}
            />
          )}
          onDragEnd={(_, newArray) => onUpdateElements?.(newArray)}
        />
      ) : (
        <>
          {elements.map((element, index) => (
            <ListElementCard
              key={index}
              element={element}
              onDelete={onDeleteFile}
              index={index}
              isDeletable={isDeletable}
            />
          ))}
        </>
      )}
    </StyledWrapper>
  );
};

export default ElementList;
