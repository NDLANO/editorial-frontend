/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useState, useMemo, memo, useCallback } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import { useQueryClient } from '@tanstack/react-query';
import { SingleValue } from '@ndla/select';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import {
  Metadata,
  Node,
  NodeChild,
  ResourceTypeWithConnection,
  TaxonomyContext,
} from '@ndla/types-taxonomy';
import partition from 'lodash/partition';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { Spinner } from '@ndla/icons';
import { groupChildNodes } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import TopicConnections from '../../../../components/Taxonomy/TopicConnections';
import SaveButton from '../../../../components/SaveButton';
import ResourceTypeSelect from '../../components/ResourceTypeSelect';
import TaxonomyInfo from './taxonomy/TaxonomyInfo';
import { TAXONOMY_ADMIN_SCOPE, RESOURCE_TYPE_LEARNING_PATH } from '../../../../constants';
import { FormikFieldHelp } from '../../../../components/FormikField';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { useSession } from '../../../Session/SessionProvider';
import VersionSelect from '../../components/VersionSelect';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { useAllResourceTypes } from '../../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import { nodesQueryKey, useNodes } from '../../../../modules/nodes/nodeQueries';
import { useUpdateTaxonomyMutation } from '../../../../modules/taxonomy/taxonomyMutations';
import { fetchChildNodes, postNode } from '../../../../modules/nodes/nodeApi';
import { NodeWithChildren } from '../../../../components/Taxonomy/TaxonomyBlockNode';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

interface Props {
  article: IArticle;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
  hasTaxEntries: boolean;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  margin-bottom: ${spacing.small};
`;

export interface MinimalNodeChild
  extends Pick<
    NodeChild,
    'id' | 'relevanceId' | 'isPrimary' | 'path' | 'name' | 'connectionId' | 'breadcrumbs'
  > {
  metadata: Pick<Metadata, 'visible'>;
}

export const contextToMinimalNodeChild = (
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
    path: context.path.split('/').slice(1).join('/'),
    name: crumb[crumb.length - 1] ?? '',
    metadata: {
      visible: context.isVisible,
    },
  };
};

export const toInitialResource = (resource: Node | undefined, language: string): TaxNode => {
  return {
    id: resource?.id ?? '',
    resourceTypes: resource?.resourceTypes ?? [],
    metadata: resource?.metadata ?? {
      grepCodes: [],
      visible: true,
      customFields: {},
    },
    placements: sortBy(
      resource?.contexts
        .filter((c) => c.rootId.includes('subject'))
        .map((c) => contextToMinimalNodeChild(c, language)),
      (c) => c.connectionId,
    ),
  };
};

export interface TaxNode extends Pick<Node, 'resourceTypes' | 'metadata' | 'id'> {
  placements: MinimalNodeChild[];
}

const LearningResourceTaxonomy = ({
  article,
  updateNotes,
  articleLanguage,
  hasTaxEntries,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const qc = useQueryClient();
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workingResource, setWorkingResource] = useState<TaxNode>(
    toInitialResource(undefined, i18n.language),
  );

  const updateTaxMutation = useUpdateTaxonomyMutation({
    onError: () => setIsError(true),
    onMutate: () => setIsError(false),
  });

  const nodesQuery = useNodes(
    {
      contentURI: `urn:article:${article.id}`,
      taxonomyVersion,
      language: articleLanguage,
      includeContexts: true,
    },
    {
      onSuccess: (data) => setWorkingResource(toInitialResource(data?.[0], i18n.language)),
    },
  );

  const initialResource: TaxNode = useMemo(
    () => JSON.parse(JSON.stringify(toInitialResource(nodesQuery.data?.[0], i18n.language))),
    [i18n.language, nodesQuery.data],
  );

  const [resources, topics] = useMemo(
    () => partition(nodesQuery.data, (node) => node.nodeType === 'RESOURCE'),
    [nodesQuery.data],
  );

  const [subjects, setSubjects] = useState<NodeWithChildren[]>([]);

  useNodes(
    { language: i18n.language, taxonomyVersion, nodeType: 'SUBJECT' },
    {
      select: (subject) =>
        sortBy(
          subject.filter((s) => !!s.name),
          (s) => s.name,
        ),
      onSuccess: (data) => setSubjects(data),
    },
  );
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const isDirty = useMemo(
    () => !isEqual(initialResource, workingResource),
    [initialResource, workingResource],
  );

  const allResourceTypesQuery = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    { select: (rts) => rts },
  );

  const { data: versions } = useVersions();

  const onChangeSelectedResource = useCallback(
    (value: SingleValue) => {
      const options = value?.value?.split(',') ?? [];
      const selectedResource = allResourceTypesQuery.data?.find((rt) => rt.id === options[0]);

      if (selectedResource) {
        const resourceTypes: ResourceTypeWithConnection[] = [
          {
            name: selectedResource.name,
            id: selectedResource.id,
            connectionId: '',
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
              connectionId: '',
              supportedLanguages: subType.supportedLanguages,
              translations: subType.translations,
            });
        }
        setWorkingResource((res) => ({ ...res, resourceTypes }));
      }
    },
    [allResourceTypesQuery.data],
  );

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
          nodeType: ['TOPIC'],
          recursive: true,
        });
        const childNodes = groupChildNodes(nodes);
        setSubjects((subjects) =>
          subjects.map((s) => (s.id === subjectId ? { ...s, childNodes } : s)),
        );
      } catch (err) {
        handleError(err);
      }
    },
    [i18n.language, subjects, taxonomyVersion],
  );

  const setPrimaryConnection = useCallback((id: string) => {
    setWorkingResource((res) => ({
      ...res,
      placements: res.placements.map((p) => ({ ...p, isPrimary: p.id === id })),
    }));
  }, []);

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
        connectionId: '',
        name: node.name,
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
            name: article.title?.title ?? '',
            nodeType: 'RESOURCE',
          },
          taxonomyVersion,
        });
        resourceId = res.replace('/v1/nodes/', '');
        setWorkingResource((r) => ({ ...r, id: resourceId }));
      }

      await updateTaxMutation.mutateAsync({
        node: { ...workingResource, id: resourceId },
        originalNode: initialResource,
        taxonomyVersion,
      });
      await updateNotes({ revision: article.revision, notes: ['Oppdatert taksonomi.'] });
      await qc.invalidateQueries(
        nodesQueryKey({
          contentURI: `urn:article:${article.id}`,
          taxonomyVersion,
          language: articleLanguage,
          includeContexts: true,
        }),
      );
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

  const removeConnection = useCallback((id: string) => {
    setWorkingResource((r) => ({ ...r, placements: r.placements.filter((p) => p.id !== id) }));
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

  const onReset = useCallback(() => {
    if (!isDirty) {
      return;
    } else if (!showWarning) {
      setShowWarning(true);
    } else {
      setWorkingResource(initialResource);
      setIsError(false);
      setShowWarning(false);
      updateTaxMutation.reset();
      changeVersion('draft');
    }
  }, [changeVersion, initialResource, isDirty, showWarning, updateTaxMutation]);

  const onVersionChanged = useCallback(
    (newVersion: SingleValue) => {
      if (!newVersion || newVersion.value === taxonomyVersion) return;
      changeVersion(newVersion.value);
      setShowWarning(false);
      setIsError(false);
      updateTaxMutation.reset();
    },
    [changeVersion, taxonomyVersion, updateTaxMutation],
  );

  const filteredResourceTypes = useMemo(
    () =>
      allResourceTypesQuery.data
        ?.filter((rt) => !blacklistedResourceTypes.includes(rt.id))
        .map((rt) => ({
          ...rt,
          subtype: rt?.subtypes.filter((st) => !blacklistedResourceTypes.includes(st.id)),
        })) ?? [],
    [allResourceTypesQuery.data],
  );

  if (nodesQuery.isInitialLoading) {
    return <Spinner />;
  }

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <>
      {!hasTaxEntries && <FormikFieldHelp error>{t('errorMessage.missingTax')}</FormikFieldHelp>}
      {isTaxonomyAdmin && (
        <TaxonomyConnectionErrors
          articleType={article.articleType ?? 'standard'}
          topics={topics}
          resources={resources}
        />
      )}
      {isTaxonomyAdmin && (
        <>
          <VersionSelect versions={versions ?? []} onVersionChanged={onVersionChanged} />
          <TaxonomyInfo taxonomyElement={workingResource} updateMetadata={updateMetadata} />
        </>
      )}
      <ResourceTypeSelect
        availableResourceTypes={filteredResourceTypes}
        resourceTypes={workingResource?.resourceTypes}
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
      {isError && <FormikFieldHelp error>{t('errorMessage.taxonomy')}</FormikFieldHelp>}
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <ButtonContainer>
        <ButtonV2 variant="outline" disabled={!isDirty} onClick={onReset}>
          {t('reset')}
        </ButtonV2>
        <SaveButton
          showSaved={updateTaxMutation.isSuccess && !isDirty}
          isSaving={isSaving}
          disabled={!isDirty || nodesQuery.isFetching}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </ButtonContainer>
      <FormikFieldHelp float="right" error>
        {t('warningMessage.taxonomy')}
      </FormikFieldHelp>
    </>
  );
};

export default memo(LearningResourceTaxonomy);
