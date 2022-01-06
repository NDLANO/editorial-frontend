/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ndla/editor';
import { ErrorMessage } from '@ndla/ui';
import Field from '../../../../components/Field';
import {
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  addTopicToTopic,
  addSubjectTopic,
  addTopic,
  queryResources,
  queryTopics,
  updateTopicMetadata,
} from '../../../../modules/taxonomy';
import {
  sortByName,
  groupTopics,
  pathToUrnArray,
  getBreadcrumbFromPath,
} from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import TopicArticleConnections from './TopicArticleConnections';

import { FormikFieldHelp } from '../../../../components/FormikField';
import { LocaleType } from '../../../../interfaces';
import {
  Resource,
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
  Topic,
  TopicConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftApiType, UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { TAXONOMY_ADMIN_SCOPE } from '../../../../constants';
import { useSession } from '../../../Session/SessionProvider';

type Props = {
  article: DraftApiType;
  setIsOpen?: (open: boolean) => void;
  updateNotes: (art: UpdatedDraftApiType) => Promise<DraftApiType>;
};

interface StructureSubject extends SubjectType {
  topics?: SubjectTopic[];
}

interface Taxonomy {
  resources: Resource[];
  topics: Topic[];
}

export interface StagedTopic extends TaxonomyElement {
  id: string;
  name: string;
  path: string;
  paths?: string[];
  breadcrumb?: TaxonomyElement[];
  topicConnections?: TopicConnections[];
  primary?: boolean;
  relevanceId?: string;
  isPrimary?: boolean;
  metadata: TaxonomyMetadata;
}

const TopicArticleTaxonomy = ({ article, setIsOpen, updateNotes }: Props) => {
  const [structure, setStructure] = useState<StructureSubject[]>([]);
  const [status, setStatus] = useState('loading');
  const [isDirty, setIsDirty] = useState(false);
  const [stagedTopicChanges, setStagedTopicChanges] = useState<StagedTopic[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [taxonomy, setTaxonomy] = useState<Taxonomy | undefined>(undefined);
  const { t, i18n } = useTranslation();
  const { userAccess } = useSession();

  useEffect(() => {
    (async () => {
      const resources = await queryResources(article.id, article.title!.language, 'article');
      const topics = await queryTopics(article.id, article.title!.language, 'article');
      const localTaxonomy = { resources, topics };
      setTaxonomy(localTaxonomy);
      try {
        const subjects = await fetchSubjects(i18n.language);

        const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);
        const activeTopics = localTaxonomy.topics.filter(t => t.path) ?? [];
        const sortedTopics = activeTopics.sort((a, b) => (a.id < b.id ? -1 : 1));

        const topicConnections = await Promise.all(
          sortedTopics.map(topic => fetchTopicConnections(topic.id)),
        );

        const topicsWithConnections = sortedTopics.map(async (topic, index) => {
          const breadcrumb = await getBreadcrumbFromPath(topic.path, i18n.language);
          return {
            ...topic,
            topicConnections: topicConnections[index],
            breadcrumb,
          };
        });
        const stagedTopicChanges = await Promise.all(topicsWithConnections);

        setStatus('initial');
        setStagedTopicChanges(stagedTopicChanges);
        setStructure(sortedSubjects);
      } catch (e) {
        handleError(e);
        setStatus('error');
      }
    })();
  }, [article.id, article.title, article.title?.language, i18n.language]);

  const getSubjectTopics = async (subjectId: string, locale: LocaleType) => {
    if (structure.some(subject => subject.id === subjectId && subject.topics)) {
      return;
    }
    try {
      updateSubject(subjectId);
      const allTopics = await fetchSubjectTopics(subjectId, locale);
      const groupedTopics = groupTopics(allTopics);
      updateSubject(subjectId, { topics: groupedTopics });
    } catch (e) {
      handleError(e);
    }
  };

  const stageTaxonomyChanges = async ({ path, locale }: { path: string; locale?: LocaleType }) => {
    if (path) {
      const breadcrumb = await getBreadcrumbFromPath(path, locale);
      const allStatuses = article.status ? article.status.other.concat(article.status.current) : [];
      const newTopic: StagedTopic = {
        id: 'staged',
        name: article.title?.title ?? '',
        path: `${path}/staged`,
        breadcrumb,
        metadata: {
          grepCodes: [],
          visible: allStatuses.some(s => s === 'PUBLISHED'),
          customFields: {},
        },
      };

      setIsDirty(true);
      setStagedTopicChanges(prev => [...prev, newTopic]);
    }
  };

  const addNewTopic = async (stagedNewTopics: StagedTopic[], locale?: LocaleType) => {
    const existingTopics = stagedTopicChanges.filter(t => !stagedNewTopics.includes(t));
    const newTopics = await Promise.all(
      stagedNewTopics.map(topic => createAndPlaceTopic(topic, article.id, locale)),
    );
    setIsDirty(false);
    setStagedTopicChanges(existingTopics.concat(newTopics));
    setStatus('success');
  };

  const handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { id: articleId, revision, supportedLanguages } = article;
    setStatus('loading');

    const stagedNewTopics = stagedTopicChanges.filter(topic => topic.id === 'staged');
    try {
      if (stagedNewTopics.length > 0) {
        await addNewTopic(stagedNewTopics, i18n.language);
      }

      updateNotes({
        id: articleId,
        revision: revision ?? 0,
        language: article.title?.language,
        notes: ['Oppdatert taksonomi.'],
        supportedLanguages: supportedLanguages ?? [],
      });
    } catch (err) {
      handleError(err);
      setStatus('error');
    }
  };

  const updateSubject = (subjectid: string, newSubject?: Partial<StructureSubject>) => {
    const newStructure = structure.map(subject => {
      if (subject.id === subjectid) {
        return { ...subject, ...newSubject };
      } else return subject;
    });
    setStructure(newStructure);
  };

  const onCancel = () => {
    if (!isDirty) {
      setIsOpen?.(false);
    } else if (showWarning) {
      setIsOpen?.(false);
    } else {
      setShowWarning(true);
    }
  };

  const createAndPlaceTopic = async (
    topic: StagedTopic,
    articleId: number,
    locale?: LocaleType,
  ): Promise<StagedTopic> => {
    const newTopicPath = await addTopic({
      name: topic.name,
      contentUri: `urn:article:${articleId}`,
    });

    const paths = pathToUrnArray(topic.path);
    const newTopicId = newTopicPath.split('/').pop() ?? '';

    if (paths.length > 2) {
      // we are placing it under a topic
      const parentTopicId = paths.slice(-2)[0];
      await addTopicToTopic({
        subtopicid: newTopicId,
        topicid: parentTopicId,
      });
    } else {
      // we are placing it under a subject
      await addSubjectTopic({
        topicid: newTopicId,
        subjectid: paths[0],
      });
    }
    if (!topic.metadata.visible) {
      await updateTopicMetadata(newTopicId, { visible: topic.metadata.visible });
    }
    const newPath = topic.path.replace('staged', newTopicId.replace('urn:', ''));
    const breadcrumb = await getBreadcrumbFromPath(newPath, locale);
    return {
      name: topic.name,
      id: newTopicId,
      path: newPath,
      breadcrumb,
      metadata: topic.metadata,
    };
  };

  if (status === 'loading') {
    return <Spinner />;
  }
  if (status === 'error') {
    return (
      <ErrorMessage
        illustration={{
          url: '/Oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('errorMessage.taxonomy'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    );
  }

  const isTaxonomyAdmin = userAccess?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <>
      {isTaxonomyAdmin && (
        <TaxonomyConnectionErrors
          articleType={article.articleType ?? 'topic-article'}
          taxonomy={taxonomy}
        />
      )}
      <TopicArticleConnections
        structure={structure}
        activeTopics={stagedTopicChanges}
        getSubjectTopics={getSubjectTopics}
        stageTaxonomyChanges={stageTaxonomyChanges}
      />
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <Field right>
        <ActionButton outline onClick={onCancel} disabled={status === 'loading'}>
          {t('form.abort')}
        </ActionButton>
        <SaveButton
          formIsDirty={isDirty}
          isSaving={status === 'loading'}
          showSaved={status === 'success' && !isDirty}
          disabled={!isDirty}
          onClick={handleSubmit}
          defaultText="saveTax"
        />
      </Field>
    </>
  );
};

export default TopicArticleTaxonomy;
