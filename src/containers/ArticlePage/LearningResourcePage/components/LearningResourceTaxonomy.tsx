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
import { Node, ResourceTypeWithConnection, TaxonomyContext } from '@ndla/types-taxonomy';
import partition from 'lodash/partition';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { Spinner } from '@ndla/icons';
import { fetchSubjectTopics, createResource } from '../../../../modules/taxonomy';
import { groupTopics } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import TopicConnections from '../../../../components/Taxonomy/TopicConnections';
import SaveButton from '../../../../components/SaveButton';
import ResourceTypeSelect from '../../components/ResourceTypeSelect';
import TaxonomyInfo from './taxonomy/TaxonomyInfo';
import {
  TAXONOMY_ADMIN_SCOPE,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_FILTER_CORE,
} from '../../../../constants';
import { FormikFieldHelp } from '../../../../components/FormikField';
import { SubjectType, SubjectTopic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { useSession } from '../../../Session/SessionProvider';
import VersionSelect from '../../components/VersionSelect';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { useAllResourceTypes } from '../../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import { useSubjects } from '../../../../modules/taxonomy/subjects';
import { nodesQueryKey, useNodes } from '../../../../modules/nodes/nodeQueries';
import { useUpdateTaxonomyMutation } from '../../../../modules/taxonomy/taxonomyMutations';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

interface Props {
  article: IArticle;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
`;

export const contextToNode = (
  context: TaxonomyContext,
  contextNode: Node,
  language: string,
): Node => {
  return {
    breadcrumbs: context.breadcrumbs[language] ?? Object.values(context.breadcrumbs)[0] ?? [],
    contentUri: contextNode.contentUri,
    contextId: context.contextId,
    contexts: [],
    id: context.connectionId,
    metadata: contextNode.metadata,
    name: contextNode.name,
    nodeType: contextNode.nodeType,
    path: context.path,
    paths: contextNode.paths,
    resourceTypes: contextNode.resourceTypes,
    supportedLanguages: contextNode.supportedLanguages,
    relevanceId: context.relevanceId ?? RESOURCE_FILTER_CORE,
    translations: contextNode.translations,
    url: context.url,
  };
};

export const toInitialResource = (resource: Node | undefined, language: string): TaxNode => {
  return {
    id: resource?.id ?? '',
    path: resource?.contexts?.find((c) => c.isPrimary)?.path ?? '',
    resourceTypes: resource?.resourceTypes ?? [],
    metadata: resource?.metadata ?? {
      grepCodes: [],
      visible: true,
      customFields: {},
    },
    placements: sortBy(
      resource?.contexts
        .filter((c) => c.rootId.includes('subject'))
        .map((c) => contextToNode(c, resource, language)) ?? [],
      (c) => c.id,
    ),
  };
};

export interface TaxNode extends Pick<Node, 'resourceTypes' | 'metadata' | 'id' | 'path'> {
  placements: Node[];
}

export interface SubjectWithTopics extends SubjectType {
  topics?: SubjectTopic[];
}

const LearningResourceTaxonomy = ({ article, updateNotes, articleLanguage }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const qc = useQueryClient();
  const [workingResource, setWorkingResource] = useState<TaxNode>(
    toInitialResource(undefined, i18n.language),
  );

  const updateTaxMutation = useUpdateTaxonomyMutation();

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

  const [subjects, setSubjects] = useState<SubjectWithTopics[]>([]);

  useSubjects(
    { language: i18n.language, taxonomyVersion },
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

  const addTopicsToSubject = useCallback((subjectId: string, topics: SubjectTopic[]) => {
    setSubjects((subjects) => subjects.map((s) => (s.id === subjectId ? { ...s, topics } : s)));
  }, []);

  const getSubjectTopics = useCallback(
    async (subjectid: string) => {
      if (subjects.some((subject) => subject.id === subjectid && subject.topics)) {
        return;
      }
      try {
        const allTopics = await fetchSubjectTopics({
          subject: subjectid,
          language: i18n.language,
          taxonomyVersion,
        });
        const groupedTopics = groupTopics(allTopics);
        addTopicsToSubject(subjectid, groupedTopics);
      } catch (err) {
        handleError(err);
      }
    },
    [i18n.language, subjects, taxonomyVersion, addTopicsToSubject],
  );

  const setPrimaryConnection = useCallback(
    (path: string) => setWorkingResource((res) => ({ ...res, path })),
    [],
  );

  const setRelevance = useCallback((id: string, relevanceId: string) => {
    setWorkingResource((res) => ({
      ...res,
      placements: res.placements.map((p) => (p.id === id ? { ...p, relevanceId } : p)),
    }));
  }, []);

  const stageTaxonomyChanges = useCallback((placements: Node[]) => {
    setWorkingResource((res) => ({
      ...res,
      placements,
      path: placements.length === 1 ? placements[0].path : res.path,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      let resourceId = workingResource.id;
      if (!resourceId.length) {
        const res = await createResource({
          body: { contentUri: `urn:article:${article.id}`, name: article.title?.title ?? '' },
          taxonomyVersion,
        });
        resourceId = res;
        setWorkingResource((res) => ({ ...res, id: res.id }));
      }

      await updateTaxMutation.mutateAsync({
        node: workingResource,
        originalNode: initialResource,
        taxonomyVersion,
      });
      await updateNotes({ revision: article.revision, notes: ['Oppdatert taksonomi.'] });
      qc.invalidateQueries(
        nodesQueryKey({
          contentURI: `urn:article:${article.id}`,
          taxonomyVersion,
          language: articleLanguage,
          includeContexts: true,
        }),
      );
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

  const removeConnection = useCallback(
    (id: string) => {
      const placements = workingResource.placements.filter((ctx) => ctx.id !== id);
      if (placements.length === 1) {
        setWorkingResource((res) => ({ ...res, path: placements[0].path, placements }));
      } else {
        setWorkingResource((res) => ({ ...res, placements }));
      }
    },
    [workingResource.placements],
  );

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
      setShowWarning(false);
      changeVersion('draft');
    }
  }, [changeVersion, initialResource, isDirty, showWarning]);

  const onVersionChanged = useCallback(
    (newVersion: SingleValue) => {
      if (!newVersion || newVersion.value === taxonomyVersion) return;
      const oldVersion = taxonomyVersion;
      changeVersion(newVersion.value);
      qc.removeQueries({
        predicate: (query) => {
          const qk = query.queryKey as [string, Record<string, any>];
          return qk[1]?.taxonomyVersion === oldVersion;
        },
      });
    },
    [changeVersion, qc, taxonomyVersion],
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
        primaryPath={workingResource.path}
        structure={subjects}
        activeTopics={workingResource.placements}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        setRelevance={setRelevance}
        stageTaxonomyChanges={stageTaxonomyChanges}
        getSubjectTopics={getSubjectTopics}
        allowMultipleSubjectsOpen={false}
      />
      {!!updateTaxMutation.error && (
        <FormikFieldHelp error>{t('errorMessage.taxonomy')}</FormikFieldHelp>
      )}
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <ButtonContainer>
        <ButtonV2 variant="outline" disabled={!isDirty} onClick={onReset}>
          {t('reset')}
        </ButtonV2>
        <SaveButton
          showSaved={updateTaxMutation.isSuccess && !isDirty}
          isSaving={updateTaxMutation.isLoading}
          disabled={!isDirty}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </ButtonContainer>
    </>
  );
};

export default memo(LearningResourceTaxonomy);
