/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import FieldHeader from "../../../../components/Field/FieldHeader";
import { HowToHelper } from "../../../../components/HowTo";
import ActiveTopicConnections from "../../../../components/Taxonomy/ActiveTopicConnections";
import TaxonomyBlockNode, { NodeWithChildren } from "../../../../components/Taxonomy/TaxonomyBlockNode";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../../../constants";
import { fetchUserData } from "../../../../modules/draft/draftApi";
import { MinimalNodeChild } from "../../LearningResourcePage/components/LearningResourceTaxonomy";

interface Props {
  structure: NodeWithChildren[];
  selectedNodes: MinimalNodeChild[] | Node[];
  addConnection: (node: Node) => void;
  getSubjectTopics: (subjectId: string) => Promise<void>;
}

const TopicArticleConnections = ({ structure, selectedNodes, addConnection, getSubjectTopics }: Props) => {
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

  const fetchFavoriteSubjects = async () => {
    const result = await fetchUserData();
    const favoriteSubjects = result.favoriteSubjects || [];
    setFavoriteSubjectIds(favoriteSubjects);
    setShowFavorites(favoriteSubjects.length > 0);
  };

  useEffect(() => {
    fetchFavoriteSubjects();
  }, []);

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

  const onAdd = useCallback(
    (node: NodeWithChildren | NodeChild) => {
      addConnection(node);
      setOpen(false);
    },
    [addConnection],
  );

  return (
    <>
      <FieldHeader title={t("taxonomy.topics.topicPlacement")} subTitle={t("taxonomy.topics.subTitleTopic")}>
        <HowToHelper pageId="TaxonomyTopicConnections" tooltip={t("taxonomy.topics.helpLabel")} />
      </FieldHeader>
      <ActiveTopicConnections activeTopics={selectedNodes} type="topic-article" />
      <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} size="large">
        <DialogTrigger asChild>
          <Button>{t(`taxonomy.topics.${"chooseTaxonomyPlacement"}`)}</Button>
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
                openedPaths={openedPaths}
                toggleOpen={handleOpenToggle}
                selectedNodes={selectedNodes}
                onRootSelected={onAdd}
                onSelect={onAdd}
              />
            ))}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default TopicArticleConnections;
