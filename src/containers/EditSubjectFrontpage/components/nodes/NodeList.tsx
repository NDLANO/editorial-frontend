/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";

import { DragVertical } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";

import DndList from "../../../../components/DndList";
import { DragHandle } from "../../../../components/DraggableItem";
import ListResource from "../../../../components/Form/ListResource";
import { routes } from "../../../../util/routeHelpers";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

interface Props {
  nodes: Node[];
  onUpdate: (value: Node[]) => void;
}

const NodeList = ({ nodes, onUpdate }: Props) => {
  const { t } = useTranslation();
  if (!nodes.length) return null;

  return (
    <StyledList>
      <DndList
        items={nodes}
        onDragEnd={(_, newArray) => onUpdate(newArray)}
        dragHandle={
          <DragHandle aria-label={t("form.file.changeOrder")}>
            <DragVertical />
          </DragHandle>
        }
        renderItem={(item) => {
          return (
            <ListResource
              key={item.id}
              title={item.name}
              url={routes.structure(item.url)}
              onDelete={() => onUpdate(nodes.filter((node) => node.id !== item.id))}
              removeElementTranslation={t("subjectpageForm.removeArticle")}
            />
          );
        }}
      />
    </StyledList>
  );
};

export default NodeList;
