/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { ModalHeader, ModalBody, ModalCloseButton, Modal, ModalTitle, ModalTrigger, ModalContent } from "@ndla/modal";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import ActiveTopicConnections from "./ActiveTopicConnections";
import TaxonomyBlockNode, { NodeWithChildren } from "./TaxonomyBlockNode";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../constants";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";
import { fetchUserData } from "../../modules/draft/draftApi";
import FieldHeader from "../Field/FieldHeader";
import HowToHelper from "../HowTo/HowToHelper";

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

interface Props {
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[];
  addConnection: (node: NodeChild) => void;
  removeConnection: (id: string) => void;
  setPrimaryConnection: (connectionId: string) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
  setRelevance: (topicId: string, relevanceId: string) => void;
}

const TopicConnections = ({
  structure,
  selectedNodes,
  addConnection,
  removeConnection,
  setPrimaryConnection,
  getSubjectTopics,
  setRelevance,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openedPaths, setOpenedPaths] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState<string[]>([]);

  const filtered = structure.filter(
    (node) => node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true",
  );

  const nodes = useMemo(
    () => (showFavorites ? filtered.filter((node) => favoriteSubjectIds.includes(node.id)) : filtered),
    [favoriteSubjectIds, showFavorites, filtered],
  );

  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  const handleOpenToggle = ({ id }: Node) => {
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

  const addNode = useCallback(
    (node: NodeChild) => {
      addConnection(node);
      setOpen(false);
    },
    [addConnection],
  );

  return (
    <>
      <FieldHeader title={t("taxonomy.topics.title")} subTitle={t("taxonomy.topics.subTitle")}>
        <HowToHelper pageId="TaxonomySubjectConnections" tooltip={t("taxonomy.topics.helpLabel")} />
      </FieldHeader>
      <ActiveTopicConnections
        activeTopics={selectedNodes}
        setRelevance={setRelevance}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        type="topicarticle"
      />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <ButtonV2>{t("taxonomy.topics.filestructureButton")}</ButtonV2>
        </ModalTrigger>
        <ModalContent
          aria-label={t("taxonomy.topics.filestructureHeading")}
          animation="subtle"
          size={{ width: "large", height: "large" }}
        >
          <StyledModalHeader>
            <ModalTitle>{t("taxonomy.topics.filestructureHeading")}</ModalTitle>
            <SwitchRoot checked={showFavorites} onCheckedChange={(details) => setShowFavorites(details.checked)}>
              <SwitchLabel>{t("taxonomy.favorites")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
            <ModalCloseButton title={t("taxonomy.topics.filestructureClose")} />
          </StyledModalHeader>
          <ModalBody>
            <hr />
            {nodes.map((node) => (
              <TaxonomyBlockNode
                key={node.id}
                node={node}
                openedPaths={openedPaths}
                toggleOpen={handleOpenToggle}
                selectedNodes={selectedNodes}
                onSelect={addNode}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopicConnections;
