/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { DragVertical } from "@ndla/icons/editor";
import { IconButton, ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import DndList from "../../../../components/DndList";
import { DragHandle } from "../../../../components/DraggableItem";
import { routes } from "../../../../util/routeHelpers";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    width: "100%",
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
            <StyledListItemRoot context="list" variant="subtle" data-testid="elementListItem">
              <ListItemContent>
                <ListItemHeading asChild consumeCss>
                  <SafeLink to={routes.structure(item.url)} unstyled>
                    {item.name}
                  </SafeLink>
                </ListItemHeading>
                <IconButton
                  size="small"
                  variant="danger"
                  onClick={() => onUpdate(nodes.filter((node) => node.id !== item.id))}
                  aria-label={t("subjectpageForm.removeArticle")}
                  title={t("subjectpageForm.removeArticle")}
                  data-testid="elementListItemDeleteButton"
                >
                  <DeleteBinLine />
                </IconButton>
              </ListItemContent>
            </StyledListItemRoot>
          );
        }}
      />
    </StyledList>
  );
};

export default NodeList;
