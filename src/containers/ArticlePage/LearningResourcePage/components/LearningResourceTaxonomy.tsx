/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent, useState, useEffect, useMemo, useRef } from 'react';
import { Spinner } from '@ndla/icons';
import { ErrorMessage } from '@ndla/ui';
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import { useQueryClient } from 'react-query';
import { SingleValue } from '@ndla/select';
import { useTranslation } from 'react-i18next';
import Field from '../../../../components/Field';
import {
  fetchResourceTypes,
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  fetchTopicResources,
  updateTaxonomy,
  fetchFullResource as fetchResource,
  createResource,
  getResourceId,
} from '../../../../modules/taxonomy';
import { sortByName, groupTopics, getBreadcrumbFromPath } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import TopicConnections from '../../../../components/Taxonomy/TopicConnections';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import ResourceTypeSelect from '../../components/ResourceTypeSelect';
import TaxonomyInfo from './taxonomy/TaxonomyInfo';
import {
  TAXONOMY_ADMIN_SCOPE,
  RESOURCE_FILTER_CORE,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../../constants';
import { FormikFieldHelp } from '../../../../components/FormikField';
import {
  TaxonomyMetadata,
  ResourceType,
  ResourceResourceType,
  SubjectType,
  SubjectTopic,
  ParentTopicWithRelevanceAndConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../interfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { useSession } from '../../../Session/SessionProvider';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import VersionSelect from '../../components/VersionSelect';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

const blacklistedResourceTypes = [RESOURCE_TYPE_LEARNING_PATH];

const emptyTaxonomy = {
  resourceTypes: [],
  topics: [],
  metadata: undefined,
};

interface FullResource {
  name: string;
  resourceTypes: ResourceResourceType[];
  topics: ParentTopicWithRelevanceAndConnections[];
  metadata?: TaxonomyMetadata;
}

interface LearningResourceSubjectType extends SubjectType {
  topics?: SubjectTopic[];
}

interface ResourceTaxonomy {
  resourceTypes: ResourceResourceType[];
  topics: ParentTopicWithRelevanceAndConnections[];
  id?: string;
  name?: string;
  metadata?: TaxonomyMetadata;
}

interface TaxonomyChanges {
  resourceTypes: ResourceResourceType[];
  topics: ParentTopicWithRelevanceAndConnections[];
  metadata?: TaxonomyMetadata;
}

interface Props {
  article: IArticle;
  taxonomy: ArticleTaxonomy;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  setIsOpen?: (open: boolean) => void;
}

type Status = 'success' | 'loading' | 'initial';

const LearningResourceTaxonomy = ({ article, taxonomy, updateNotes, setIsOpen }: Props) => {
  const [resourceId, setResourceId] = useState<string>('');
  const [structure, setStructure] = useState<LearningResourceSubjectType[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [resourceTaxonomy, setResourceTaxonomy] = useState<ResourceTaxonomy>({
    ...emptyTaxonomy,
  });
  const [taxonomyChanges, setTaxonomyChanges] = useState<TaxonomyChanges>({ ...emptyTaxonomy });
  const [availableResourceTypes, setAvailableResourceTypes] = useState<ResourceType[]>([]);

  const { t, i18n } = useTranslation();
  const { userPermissions } = useSession();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data: versions } = useVersions();
  const qc = useQueryClient();
  const prevTaxVersion = useRef(taxonomyVersion);

  const onChangeSelectedResource = (evt: FormEvent<HTMLSelectElement>) => {
    const options = evt.currentTarget?.value?.split(',');
    const selectedResource = availableResourceTypes.find(
      resourceType => resourceType.id === options[0],
    );

    if (selectedResource) {
      const resourceTypes: ResourceResourceType[] = [
        {
          name: selectedResource.name,
          id: selectedResource.id,
          parentId: '',
          connectionId: '',
        },
      ];

      if (options.length > 1) {
        const subType = selectedResource.subtypes?.find(subtype => subtype.id === options[1]);
        if (subType)
          resourceTypes.push({
            id: subType.id,
            name: subType.name,
            parentId: selectedResource.id,
            connectionId: '',
          });
      }
      stageTaxonomyChanges({ resourceTypes });
    }
  };

  const getSubjectTopics = async (subjectid: string) => {
    if (structure.some(subject => subject.id === subjectid && subject.topics)) {
      return;
    }
    try {
      const allTopics = await fetchSubjectTopics({
        subject: subjectid,
        language: i18n.language,
        taxonomyVersion,
      });
      const groupedTopics = groupTopics(allTopics);
      updateSubject(subjectid, { topics: groupedTopics });
    } catch (err) {
      handleError(err);
    }
  };

  const setPrimaryConnection = (id: string) => {
    const { topics } = taxonomyChanges;

    stageTaxonomyChanges({
      topics: topics?.map(topic => ({
        ...topic,
        primary: topic.id === id,
      })),
    });
  };

  const setRelevance = (topicId: string, relevanceId: string) => {
    const { topics } = taxonomyChanges;

    stageTaxonomyChanges({
      topics: topics?.map(topic => ({
        ...topic,
        ...(topic.id === topicId && {
          relevanceId,
        }),
      })),
    });
  };

  const fetchTaxonomy = async () => {
    const { id } = article;
    if (!id) return;
    try {
      const resourceId = taxonomy.resources.length === 1 && taxonomy.resources[0].id;

      if (taxonomy.resources.length > 1) {
        setError('errorMessage.taxonomy');
      } else if (resourceId) {
        const fullResource = await fetchFullResource(resourceId, i18n.language);

        setResourceId(resourceId);
        setStatus('initial');
        setResourceTaxonomy(fullResource);
        setTaxonomyChanges(fullResource);
      } else {
        // resource does not exist in taxonomy
        setStatus('initial');
        setResourceTaxonomy({
          ...emptyTaxonomy,
        });
        setTaxonomyChanges({
          ...emptyTaxonomy,
        });
      }
    } catch (e) {
      handleError(e);
      setError('errorMessage.versionSelect');
    }
  };

  const fetchTaxonomyChoices = async () => {
    try {
      const [allResourceTypes, subjects] = await Promise.all([
        fetchResourceTypes({ language: i18n.language, taxonomyVersion }),
        fetchSubjects({ language: i18n.language, taxonomyVersion }),
      ]);

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);
      if (!error) {
        setAvailableResourceTypes(allResourceTypes.filter(resourceType => resourceType.name));
        setStructure(sortedSubjects);
      }
    } catch (e) {
      handleError(e);
      setError('errorMessage.taxonomy');
    }
  };

  const stageTaxonomyChanges = (properties: Partial<TaxonomyChanges>) => {
    setIsDirty(true);
    setTaxonomyChanges({ ...taxonomyChanges, ...properties });
  };

  const handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    let reassignedResourceId = resourceId;
    const { id, title, revision } = article;

    if (!title?.language || !id) return;
    setStatus('loading');
    try {
      if (!reassignedResourceId) {
        await createResource({
          body: { contentUri: `urn:article:${id}`, name: title.title },
          taxonomyVersion,
        });
        reassignedResourceId = await getResourceId({
          id,
          language: title.language,
          taxonomyVersion,
        });
        setResourceId(reassignedResourceId);
      }
      if (reassignedResourceId) {
        await updateTaxonomy({
          resourceId: reassignedResourceId,
          resourceTaxonomy,
          taxonomyChanges,
          taxonomyVersion,
        });
        updateNotes({
          revision: revision ?? 0,
          language: title.language,
          notes: ['Oppdatert taksonomi.'],
        });
        setStatus('success');
        setIsDirty(false);
        silentlyRefetchResourceTaxonomy();
      }
    } catch (err) {
      handleError(err);
      setError('errorMessage.taxonomy');
    }
  };

  const silentlyRefetchResourceTaxonomy = async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    const resourceTaxonomy = await fetchFullResource(resourceId, i18n.language ?? '');
    setResourceTaxonomy(resourceTaxonomy);
  };

  const fetchFullResource = async (
    resourceId: string,
    locale: LocaleType,
  ): Promise<FullResource> => {
    const { resourceTypes, metadata, parents, name } = await fetchResource({
      id: resourceId,
      language: locale,
      taxonomyVersion,
    });
    const sortedParents = parents.filter(pt => pt.path).sort((a, b) => (a.id < b.id ? -1 : 1));

    const topicConnections = await Promise.all(
      sortedParents.map(topic => fetchTopicConnections({ id: topic.id, taxonomyVersion })),
    );
    const topicResources = await Promise.all(
      sortedParents.map(topic => fetchTopicResources({ topicUrn: topic.id, taxonomyVersion })),
    );
    const topicsWithConnectionsAndRelevanceId = sortedParents.map(async (topic, index) => {
      const foundRelevanceId = topicResources[index]?.find(resource => resource.id === resourceId)
        ?.relevanceId;
      const breadcrumb = await getBreadcrumbFromPath(topic.path, taxonomyVersion, locale);
      return {
        ...topic,
        topicConnections: topicConnections[index],
        relevanceId: foundRelevanceId ?? RESOURCE_FILTER_CORE,
        breadcrumb,
      };
    });
    const topics = await Promise.all(topicsWithConnectionsAndRelevanceId);

    return {
      name,
      resourceTypes,
      topics,
      metadata,
    };
  };

  const updateSubject = (subjectId: string, newSubject: Partial<LearningResourceSubjectType>) => {
    setStructure(
      structure.map(subject =>
        subject.id === subjectId ? { ...subject, ...newSubject } : subject,
      ),
    );
  };

  const removeConnection = (id: string) => {
    const { topics } = taxonomyChanges;
    const updatedTopics = topics?.filter(topic => topic.id !== id);

    // Auto set primary of only one connection.
    if (updatedTopics?.length === 1) {
      updatedTopics[0].primary = true;
    }
    stageTaxonomyChanges({
      topics: updatedTopics,
    });
  };

  const updateMetadata = (visible: boolean) => {
    const metadata = resourceTaxonomy.metadata;
    stageTaxonomyChanges({
      metadata: {
        customFields: {},
        grepCodes: metadata?.grepCodes ?? [],
        visible,
      },
    });
  };

  const onCancel = () => {
    if (!isDirty) {
      setIsOpen?.(false);
    } else {
      if (showWarning) {
        setIsOpen?.(false);
      } else {
        setShowWarning(true);
      }
    }
  };

  const onVersionChanged = (newVersion: SingleValue) => {
    if (!newVersion || newVersion.value === taxonomyVersion) return;
    const oldVersion = taxonomyVersion;
    try {
      setStatus('loading');
      setIsDirty(false);
      changeVersion(newVersion.value);
      qc.removeQueries({
        predicate: query => {
          const qk = query.queryKey as [string, Record<string, any>];
          return qk[1]?.taxonomyVersion === oldVersion;
        },
      });
    } catch (e) {
      handleError(e);
      setError('errorMessage.taxonomy');
    }
  };

  useEffect(() => {
    fetchTaxonomy();
    fetchTaxonomyChoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevTaxVersion.current || prevTaxVersion.current === '') {
      if (prevTaxVersion.current !== taxonomyVersion) fetchTaxonomy();
    }
    prevTaxVersion.current = taxonomyVersion;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxonomyVersion]);

  const filteredResourceTypes = useMemo(
    () =>
      availableResourceTypes
        .filter(rt => !blacklistedResourceTypes.includes(rt.id))
        .map(rt => ({
          ...rt,
          subtype:
            rt.subtypes && rt.subtypes.filter(st => !blacklistedResourceTypes.includes(st.id)),
        })),
    [availableResourceTypes],
  );

  if (error) {
    return (
      <ErrorMessage
        illustration={{
          url: '/Oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t(error),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    );
  }
  if (status === 'loading') {
    return <Spinner />;
  }

  const mainResource = taxonomy.resources?.[0];
  const mainEntity = mainResource && {
    id: mainResource.id,
    name: mainResource.name,
    metadata: taxonomyChanges.metadata,
  };

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <>
      {isTaxonomyAdmin && (
        <TaxonomyConnectionErrors
          articleType={article.articleType ?? 'standard'}
          taxonomy={taxonomy}
        />
      )}
      {isTaxonomyAdmin && resourceId && (
        <>
          <VersionSelect versions={versions ?? []} onVersionChanged={onVersionChanged} />
          <TaxonomyInfo taxonomyElement={mainEntity} updateMetadata={updateMetadata} />
        </>
      )}
      <ResourceTypeSelect
        availableResourceTypes={filteredResourceTypes}
        resourceTypes={taxonomyChanges.resourceTypes}
        onChangeSelectedResource={onChangeSelectedResource}
      />
      <TopicConnections
        structure={structure}
        activeTopics={taxonomyChanges.topics}
        removeConnection={removeConnection}
        setPrimaryConnection={setPrimaryConnection}
        setRelevance={setRelevance}
        stageTaxonomyChanges={stageTaxonomyChanges}
        getSubjectTopics={getSubjectTopics}
        allowMultipleSubjectsOpen={false}
        onChangeShowFavorites={() => {}}
      />
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <Field right>
        <ActionButton outline onClick={onCancel}>
          {t('form.abort')}
        </ActionButton>
        <SaveButton
          showSaved={status === 'success' && !isDirty}
          disabled={!isDirty || !taxonomyChanges.resourceTypes.length}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </Field>
    </>
  );
};

export default LearningResourceTaxonomy;
