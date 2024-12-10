/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import differenceBy from "lodash/differenceBy";
import isEqual from "lodash/isEqual";
import partition from "lodash/partition";
import { useCallback, useMemo, useState, MouseEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Button, ExpandableBox, ExpandableBoxSummary, SelectLabel, Text, UnOrderedList } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node, Version } from "@ndla/types-taxonomy";
import TopicArticleConnections from "./TopicArticleConnections";
import { FormActionsContainer, FormContent } from "../../../../components/FormikForm";
import SaveButton from "../../../../components/SaveButton";
import OptGroupVersionSelector from "../../../../components/Taxonomy/OptGroupVersionSelector";
import { NodeWithChildren } from "../../../../components/Taxonomy/TaxonomyBlockNode";
import { TAXONOMY_ADMIN_SCOPE } from "../../../../constants";
import { fetchChildNodes } from "../../../../modules/nodes/nodeApi";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useCreateTopicNodeConnectionsMutation } from "../../../../modules/taxonomy/taxonomyMutations";
import handleError from "../../../../util/handleError";
import { groupChildNodes } from "../../../../util/taxonomyHelpers";
import { useSession } from "../../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import TaxonomyConnectionErrors from "../../components/TaxonomyConnectionErrors";

interface Props {
  hasTaxEntries: boolean;
  article: IArticle;
  versions: Version[];
  subjects: NodeWithChildren[];
  nodes: Node[];
  validPlacements: Node[];
  invalidPlacements: Node[];
  articleLanguage: string;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
}

const StyledLi = styled("li", {
  base: {
    color: "text.error",
  },
});

const TopicTaxonomyBlock = ({
  hasTaxEntries,
  article,
  versions,
  validPlacements: propValidPlacements,
  invalidPlacements,
  nodes,
  subjects: propSubjects,
  articleLanguage,
  updateNotes,
}: Props) => {
  const { userPermissions } = useSession();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showWarning, setShowWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState<NodeWithChildren[]>(propSubjects);
  const [placements, setPlacements] = useState<Node[]>(propValidPlacements);

  const createTopicNodeConnectionsMutation = useCreateTopicNodeConnectionsMutation();

  const initialPlacements: Node[] = useMemo(
    () => JSON.parse(JSON.stringify(propValidPlacements)),
    [propValidPlacements],
  );

  const [resources, topics] = useMemo(() => partition(nodes, (node) => node.nodeType === "RESOURCE"), [nodes]);

  const isDirty = useMemo(() => !isEqual(initialPlacements, placements), [initialPlacements, placements]);

  useEffect(() => {
    setPlacements(propValidPlacements);
  }, [propValidPlacements]);

  const onVersionChanged = useCallback(
    (versionHash: string) => {
      if (versionHash === taxonomyVersion) return;
      changeVersion(versionHash);
      setShowWarning(false);
      createTopicNodeConnectionsMutation.reset();
    },
    [changeVersion, createTopicNodeConnectionsMutation, taxonomyVersion],
  );

  const handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setIsSaving(true);
    const newNodes = differenceBy(placements, initialPlacements, (p) => p.id);
    if (!newNodes.length) return;
    try {
      await createTopicNodeConnectionsMutation.mutateAsync({
        placements: newNodes,
        name: article.title?.title ?? "",
        articleId: article.id,
        taxonomyVersion,
      });
      await updateNotes({
        revision: article.revision,
        language: article.title?.language,
        notes: ["Oppdatert taksonomi."],
        metaImage: undefined,
        responsibleId: undefined,
      });
      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({
          contentURI: `urn:article:${article.id}`,
          taxonomyVersion,
          language: articleLanguage,
          includeContexts: true,
        }),
      });
      setIsSaving(false);
      qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({
          language: articleLanguage,
          taxonomyVersion,
          nodeType: "SUBJECT",
        }),
      });
    } catch (err) {
      handleError(err);
      setIsSaving(false);
    }
  };

  const onReset = useCallback(() => {
    if (!isDirty) {
      return;
    } else if (!showWarning) {
      setShowWarning(true);
    } else {
      setPlacements(initialPlacements);
      setShowWarning(false);
      changeVersion("draft");
    }
  }, [changeVersion, initialPlacements, isDirty, showWarning]);

  const addConnection = useCallback((node: Node) => {
    setPlacements((placements) => placements.concat(node));
  }, []);

  const getSubjectTopics = useCallback(
    async (subjectId: string) => {
      if (subjects.some((subject) => subject.id === subjectId && !!subject.childNodes)) {
        return;
      }
      try {
        const nodes = await fetchChildNodes({
          id: subjectId,
          language: articleLanguage,
          taxonomyVersion,
          nodeType: ["TOPIC"],
          recursive: true,
        });
        const childNodes = groupChildNodes(nodes);
        setSubjects((subjects) => subjects.map((s) => (s.id === subjectId ? { ...s, childNodes } : s)));
      } catch (err) {
        handleError(err);
      }
    },
    [articleLanguage, subjects, taxonomyVersion],
  );

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);
  return (
    <FormContent>
      {!hasTaxEntries && <Text color="text.error">{t("errorMessage.missingTax")}</Text>}
      {!!isTaxonomyAdmin && (
        <>
          <TaxonomyConnectionErrors
            articleType={article.articleType ?? "topic-article"}
            resources={resources}
            topics={topics}
          />
          <OptGroupVersionSelector
            currentVersion={taxonomyVersion}
            onVersionChanged={(version) => onVersionChanged(version.hash)}
            versions={versions}
          >
            <SelectLabel>{t("taxonomy.version")}</SelectLabel>
          </OptGroupVersionSelector>
        </>
      )}
      <TopicArticleConnections
        addConnection={addConnection}
        structure={subjects}
        selectedNodes={placements}
        getSubjectTopics={getSubjectTopics}
      />
      {!!invalidPlacements.length && !!isTaxonomyAdmin && (
        <ExpandableBox>
          <ExpandableBoxSummary>{t("errorMessage.invalidTopicPlacements")}</ExpandableBoxSummary>
          <UnOrderedList>
            {placements.map((placement) => (
              <StyledLi key={placement.id}>{placement.id}</StyledLi>
            ))}
          </UnOrderedList>
        </ExpandableBox>
      )}
      {!!showWarning && <Text color="text.error">{t("errorMessage.unsavedTaxonomy")}</Text>}
      <FormActionsContainer>
        <Button
          variant="secondary"
          onClick={onReset}
          disabled={!isDirty || createTopicNodeConnectionsMutation.isPending}
        >
          {t("reset")}
        </Button>
        <SaveButton
          loading={isSaving}
          showSaved={!!createTopicNodeConnectionsMutation.isSuccess && !isDirty}
          disabled={!isDirty || isSaving}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </FormActionsContainer>
    </FormContent>
  );
};

export default TopicTaxonomyBlock;
