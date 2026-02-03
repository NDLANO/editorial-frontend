/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeWithChildren } from "../../modules/nodes/nodeApiTypes";
import { DialogCloseButton } from "../DialogCloseButton";
import TaxonomyBlockNode from "./TaxonomyBlockNode";
import { MinimalNodeChild } from "./types";

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

interface Props {
  type: "topic" | "resource";
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[] | Node[];
  favoriteSubjects: string[] | undefined;
  addConnection: (node: Node | NodeChild) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
}

export const AddConnectionDialog = ({
  type,
  structure,
  favoriteSubjects,
  selectedNodes,
  addConnection,
  getSubjectTopics,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(true);

  const nodes = useMemo(
    () => (showFavorites ? structure.filter((node) => favoriteSubjects?.includes(node.id)) : structure),
    [showFavorites, structure, favoriteSubjects],
  );

  const addNode = useCallback(
    (node: NodeChild | Node) => {
      addConnection(node);
      setOpen(false);
    },
    [addConnection],
  );

  useEffect(() => {
    if (favoriteSubjects) {
      setShowFavorites(!!favoriteSubjects.length);
    }
  }, [favoriteSubjects]);
  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} size="large">
      <DialogTrigger asChild>
        <StyledButton>
          {type === "topic" ? t("taxonomy.topics.chooseTaxonomyPlacement") : t("taxonomy.topics.filestructureButton")}
        </StyledButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("taxonomy.topics.filestructureHeading")}</DialogTitle>
          <DialogCloseButton title={t("taxonomy.topics.filestructureClose")} />
        </DialogHeader>
        <DialogBody>
          <SwitchRoot checked={showFavorites} onCheckedChange={(details) => setShowFavorites(details.checked)}>
            <SwitchLabel>{t("taxonomy.favorites")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </SwitchRoot>
          {nodes.map((node) => (
            <TaxonomyBlockNode
              key={node.id}
              node={node}
              selectedNodes={selectedNodes}
              onSelect={addNode}
              onRootSelected={type === "topic" ? addNode : undefined}
              getSubjectTopics={getSubjectTopics}
            />
          ))}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
