/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import partition from "lodash/partition";
import sortBy from "lodash/sortBy";
import { useCallback, useMemo, useState, MouseEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Button, SelectLabel } from "@ndla/primitives";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import {
  Node,
  NodeChild,
  NodeType,
  ResourceType,
  ResourceTypeWithConnection,
  TaxonomyContext,
  Version,
} from "@ndla/types-taxonomy";
import TaxonomyInfo from "./TaxonomyInfo";
import { FormikFieldHelp } from "../../../../../components/FormikField";
import { FormActionsContainer, FormContent } from "../../../../../components/FormikForm";
import SaveButton from "../../../../../components/SaveButton";
import OptGroupVersionSelector from "../../../../../components/Taxonomy/OptGroupVersionSelector";
import { NodeWithChildren } from "../../../../../components/Taxonomy/TaxonomyBlockNode";
import TopicConnections from "../../../../../components/Taxonomy/TopicConnections";
import { RESOURCE_TYPE_LEARNING_PATH, TAXONOMY_ADMIN_SCOPE } from "../../../../../constants";
import { fetchChildNodes, postNode } from "../../../../../modules/nodes/nodeApi";
import { nodeQueryKeys } from "../../../../../modules/nodes/nodeQueries";
import { useUpdateTaxonomyMutation } from "../../../../../modules/taxonomy/taxonomyMutations";
import handleError from "../../../../../util/handleError";
import { groupChildNodes } from "../../../../../util/taxonomyHelpers";
import { useSession } from "../../../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../../../StructureVersion/TaxonomyVersionProvider";
import ResourceTypeSelect from "../../../components/ResourceTypeSelect";
import TaxonomyConnectionErrors from "../../../components/TaxonomyConnectionErrors";
import { MinimalNodeChild } from "../LearningResourceTaxonomy";

interface Props {
  nodes: Node[];
  subjects: Node[];
  hasTaxEntries: boolean;
  resourceTypes: ResourceType[];
  article: IArticle;
  versions: Version[];
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

export interface TaxNode extends Pick<Node, "resourceTypes" | "metadata" | "id" | "context"> {
  placements: MinimalNodeChild[];
}

export const contextToMinimalNodeChild = (
  nodeType: NodeType,
  context: TaxonomyContext,
  articleLanguage: string,
): MinimalNodeChild => {
  const crumb = context.breadcrumbs[articleLanguage] ?? Object.values(context.breadcrumbs)[0] ?? [];
  return {
    id: context.parentIds[context.parentIds.length - 1],
    breadcrumbs: crumb,
    relevanceId: context.relevanceId,
    connectionId: context.connectionId,
    isPrimary: context.isPrimary,
    path: context.path.split("/").slice(1).join("/"),
    name: crumb[crumb.length - 1] ?? "",
    metadata: {
      visible: context.isVisible,
    },
    nodeType,
    context,
  };
};

export const toInitialResource = (resource: Node | undefined, language: string): TaxNode => {
  return {
    id: resource?.id ?? "",
    resourceTypes: resource?.resourceTypes ?? [],
    metadata: resource?.metadata ?? {
      grepCodes: [],
      visible: true,
      customFields: {},
    },
    context: resource?.context,
    placements: sortBy(
      resource?.contexts
        .filter((c) => c.rootId.includes("subject"))
        .map((c) => contextToMinimalNodeChild(resource.nodeType, c, language)),
      (c) => c.connectionId,
    ),
  };
};

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const TaxonomyBlock = ({
  nodes,
  subjects: propSubjects,
  hasTaxEntries,
  resourceTypes,
  versions,
  article,
  updateNotes,
  articleLanguage,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const [subjects, setSubjects] = useState<NodeWithChildren[]>(propSubjects);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workingResource, setWorkingResource] = useState<TaxNode>(toInitialResource(nodes[0], i18n.language));

  useEffect(() => {
    setWorkingResource(toInitialResource(nodes[0], i18n.language));
  }, [i18n.language, nodes]);

  const qc = useQueryClient();

  const updateTaxMutation = useUpdateTaxonomyMutation();

  const [resources, topics] = useMemo(() => partition(nodes, (node) => node.nodeType === "RESOURCE"), [nodes]);

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const initialResource: TaxNode = useMemo(
    () => JSON.parse(JSON.stringify(toInitialResource(nodes[0], i18n.language))),
    [i18n.language, nodes],
  );

  const isDirty = useMemo(() => !isEqual(initialResource, workingResource), [initialResource, workingResource]);

  const filteredResourceTypes = useMemo(
    () =>
      resourceTypes
        .filter((rt) => !blacklistedResourceTypes.includes(rt.id))
        .map((rt) => ({
          ...rt,
          subtype: rt?.subtypes?.filter((st) => !blacklistedResourceTypes.includes(st.id)),
        })) ?? [],
    [resourceTypes],
  );

  const onVersionChanged = useCallback(
    (versionHash: string) => {
      if (versionHash === taxonomyVersion) return;
      changeVersion(versionHash);
      setShowWarning(false);
      updateTaxMutation.reset();
    },
    [changeVersion, taxonomyVersion, updateTaxMutation],
  );

  const onReset = useCallback(() => {
    if (!isDirty) {
      return;
    } else if (!showWarning) {
      setShowWarning(true);
    } else {
      setWorkingResource(initialResource);
      setShowWarning(false);
      updateTaxMutation.reset();
      changeVersion("draft");
    }
  }, [changeVersion, initialResource, isDirty, showWarning, updateTaxMutation]);

  const removeConnection = useCallback((id: string) => {
    setWorkingResource((r) => ({
      ...r,
      placements: r.placements.filter((p) => p.id !== id),
    }));
  }, []);

  const updateMetadata = useCallback((visible: boolean) => {
    setWorkingResource((res) => ({
      ...res,
      metadata: {
        ...res.metadata,
        visible,
      },
    }));
  }, []);

  const setPrimaryConnection = useCallback((id: string) => {
    setWorkingResource((res) => ({
      ...res,
      placements: res.placements.map((p) => ({ ...p, isPrimary: p.id === id })),
    }));
  }, []);

  const getSubjectTopics = useCallback(
    async (subjectId: string) => {
      if (subjects.some((subject) => subject.id === subjectId && !!subject.childNodes)) {
        return;
      }
      try {
        const nodes = await fetchChildNodes({
          id: subjectId,
          language: i18n.language,
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
    [i18n.language, subjects, taxonomyVersion],
  );

  const setRelevance = useCallback((id: string, relevanceId: string) => {
    setWorkingResource((res) => ({
      ...res,
      placements: res.placements.map((p) => (p.id === id ? { ...p, relevanceId } : p)),
    }));
  }, []);

  const addConnection = useCallback((node: NodeChild) => {
    setWorkingResource((res) => {
      const newPlacement: MinimalNodeChild = {
        id: node.id,
        path: node.path,
        isPrimary: res.placements.length === 0,
        relevanceId: node.relevanceId,
        breadcrumbs: node.breadcrumbs,
        metadata: {
          visible: node.metadata.visible,
        },
        connectionId: "",
        name: node.name,
        nodeType: node.nodeType,
      };
      return { ...res, placements: res.placements.concat(newPlacement) };
    });
  }, []);

  const handleSubmit = useCallback(
    async (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      setIsSaving(true);
      let resourceId = workingResource.id;
      if (!resourceId.length) {
        const res = await postNode({
          body: {
            contentUri: `urn:article:${article.id}`,
            name: article.title?.title ?? "",
            nodeType: "RESOURCE",
          },
          taxonomyVersion,
        });
        resourceId = res.replace("/v1/nodes/", "");
        setWorkingResource((r) => ({ ...r, id: resourceId }));
      }

      await updateTaxMutation.mutateAsync({
        node: { ...workingResource, id: resourceId },
        originalNode: initialResource,
        taxonomyVersion,
      });
      await updateNotes({
        revision: article.revision,
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
    },
    [
      article.id,
      article.revision,
      article.title?.title,
      articleLanguage,
      initialResource,
      qc,
      taxonomyVersion,
      updateNotes,
      updateTaxMutation,
      workingResource,
    ],
  );

  const onChangeSelectedResource = useCallback(
    (value?: string) => {
      const options = value?.split(",") ?? [];
      const selectedResource = resourceTypes.find((rt) => rt.id === options[0]);

      if (selectedResource) {
        const resourceTypes: ResourceTypeWithConnection[] = [
          {
            name: selectedResource.name,
            id: selectedResource.id,
            connectionId: "",
            supportedLanguages: selectedResource.supportedLanguages,
            translations: selectedResource.translations,
          },
        ];

        if (options.length > 1) {
          const subType = selectedResource.subtypes?.find((subtype) => subtype.id === options[1]);
          if (subType)
            resourceTypes.push({
              id: subType.id,
              name: subType.name,
              connectionId: "",
              supportedLanguages: subType.supportedLanguages,
              translations: subType.translations,
            });
        }
        setWorkingResource((res) => ({ ...res, resourceTypes }));
      }
    },
    [resourceTypes],
  );

  return (
    <FormContent>
      {!hasTaxEntries && <FormikFieldHelp error>{t("errorMessage.missingTax")}</FormikFieldHelp>}
      {!!isTaxonomyAdmin && (
        <TaxonomyConnectionErrors
          articleType={article.articleType ?? "standard"}
          topics={topics}
          resources={resources}
        />
      )}
      {!!isTaxonomyAdmin && (
        <>
          <OptGroupVersionSelector
            currentVersion={taxonomyVersion}
            onVersionChanged={(version) => onVersionChanged(version.hash)}
            versions={versions}
          >
            <SelectLabel>{t("taxonomy.version")}</SelectLabel>
          </OptGroupVersionSelector>
          <TaxonomyInfo taxonomyElement={workingResource} updateMetadata={updateMetadata} />
        </>
      )}
      <ResourceTypeSelect
        selectedResourceTypes={workingResource.resourceTypes}
        availableResourceTypes={filteredResourceTypes}
        onChangeSelectedResource={onChangeSelectedResource}
      />
      <TopicConnections
        addConnection={addConnection}
        structure={subjects}
        selectedNodes={workingResource.placements}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        setRelevance={setRelevance}
        getSubjectTopics={getSubjectTopics}
      />
      {!!updateTaxMutation.isError && <FormikFieldHelp error>{t("errorMessage.taxonomy")}</FormikFieldHelp>}
      {!!showWarning && <FormikFieldHelp error>{t("errorMessage.unsavedTaxonomy")}</FormikFieldHelp>}
      <FormActionsContainer>
        <Button variant="secondary" disabled={!isDirty} onClick={onReset}>
          {t("reset")}
        </Button>
        <SaveButton
          showSaved={!!updateTaxMutation.isSuccess && !isDirty}
          loading={isSaving}
          disabled={!isDirty || isSaving}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </FormActionsContainer>
    </FormContent>
  );
};

export default TaxonomyBlock;
