/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Text,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import TaxonomyBlockNode from "./TaxonomyBlockNode";
import { NodeWithChildren } from "../../modules/nodes/nodeApiTypes";
import { DialogCloseButton } from "../DialogCloseButton";
import ActiveTopicConnection from "./ActiveTopicConnection";
import { MinimalNodeChild } from "./types";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexDirection: "column",
  },
});

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const StyledConnectionsList = styled("ul", {
  base: {
    listStyle: "none",
    marginBottom: "small",
  },
});

interface Props {
  type: "topic" | "resource";
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[] | Node[];
  addConnection: (node: Node | NodeChild) => void;
  removeConnection: (id: string) => void;
  setPrimaryConnection: (connectionId: string) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
  setRelevance: (topicId: string, relevanceId: string) => void;
}

const useTopicConnectionTranslations = (type: "topic" | "resource") => {
  const { t } = useTranslation();
  if (type === "topic") {
    return {
      title: t("taxonomy.topics.topicPlacement"),
      description: t("taxonomy.topics.description"),
      trigger: t("taxonomy.topics.chooseTaxonomyPlacement"),
    };
  } else {
    return {
      title: t("taxonomy.topics.title"),
      description: t("taxonomy.topics.taxonomySubjectConnections"),
      trigger: t("taxonomy.topics.filestructureButton"),
    };
  }
};

const TopicConnections = ({
  structure,
  selectedNodes,
  addConnection,
  removeConnection,
  setPrimaryConnection,
  getSubjectTopics,
  setRelevance,
  type,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(true);
  const connectionTranslations = useTopicConnectionTranslations(type);

  const addNode = useCallback(
    (node: NodeChild | Node) => {
      addConnection(node);
      setOpen(false);
    },
    [addConnection],
  );

  return (
    <Wrapper>
      <Text textStyle="label.medium" fontWeight="bold">
        {connectionTranslations.title}
      </Text>
      <Text>{connectionTranslations.description}</Text>
      <StyledConnectionsList>
        {selectedNodes.map((node) => (
          <ActiveTopicConnection
            key={node.id}
            node={node}
            setRelevance={setRelevance}
            removeConnection={removeConnection}
            setPrimaryConnection={setPrimaryConnection}
            type={type}
          />
        ))}
      </StyledConnectionsList>
      <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} size="large">
        <DialogTrigger asChild>
          <StyledButton>{connectionTranslations.trigger}</StyledButton>
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
            {structure.map((node) => (
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
    </Wrapper>
  );
};

export default TopicConnections;
