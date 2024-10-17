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
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node, Version } from "@ndla/types-taxonomy";
import TopicArticleConnections from "./TopicArticleConnections";
import { FormikFieldHelp } from "../../../../components/FormikField";
import SaveButton from "../../../../components/SaveButton";
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
import VersionSelect from "../../components/VersionSelect";

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  margin-bottom: ${spacing.small};
`;

const InvalidPlacementsWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  width: 100%;
  padding: 0px;
  margin: 0px 0px ${spacing.normal} ${spacing.normal};
`;

const InvalidPlacement = styled.li`
  width: 100%;
  color: ${colors.support.red};
  margin: 0px;
  margin: 0px;
  padding: 0px;
`;

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
    <>
      {!hasTaxEntries && <FormikFieldHelp error>{t("errorMessage.missingTax")}</FormikFieldHelp>}
      {isTaxonomyAdmin && (
        <>
          <TaxonomyConnectionErrors
            articleType={article.articleType ?? "topic-article"}
            resources={resources}
            topics={topics}
          />
          <VersionSelect versions={versions ?? []} onVersionChanged={onVersionChanged} />
        </>
      )}
      <TopicArticleConnections
        addConnection={addConnection}
        structure={subjects}
        selectedNodes={placements}
        getSubjectTopics={getSubjectTopics}
      />
      {!!invalidPlacements.length && isTaxonomyAdmin && (
        <details>
          <summary>{t("errorMessage.invalidTopicPlacements")}</summary>
          <InvalidPlacementsWrapper>
            {invalidPlacements.map((placement) => (
              <InvalidPlacement key={placement.id}>{placement.id}</InvalidPlacement>
            ))}
          </InvalidPlacementsWrapper>
        </details>
      )}
      {showWarning && <FormikFieldHelp error>{t("errorMessage.unsavedTaxonomy")}</FormikFieldHelp>}
      <ButtonContainer>
        <ButtonV2
          variant="outline"
          onClick={onReset}
          disabled={!isDirty || createTopicNodeConnectionsMutation.isPending}
        >
          {t("reset")}
        </ButtonV2>
        <SaveButton
          isSaving={isSaving}
          showSaved={createTopicNodeConnectionsMutation.isSuccess && !isDirty}
          disabled={!isDirty || isSaving}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </ButtonContainer>
    </>
  );
};

export default TopicTaxonomyBlock;
