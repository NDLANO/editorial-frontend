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
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import Field from '../../../../components/Field';
import {
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  addTopicToTopic,
  addSubjectTopic,
  addTopic,
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
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TaxonomyMetadata,
  TopicConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { TAXONOMY_ADMIN_SCOPE } from '../../../../constants';
import { useSession } from '../../../Session/SessionProvider';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

type Props = {
  article: IArticle;
  setIsOpen?: (open: boolean) => void;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  taxonomy: ArticleTaxonomy;
};

interface StructureSubject extends SubjectType {
  topics?: SubjectTopic[];
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

const TopicArticleTaxonomy = ({ article, setIsOpen, updateNotes, taxonomy }: Props) => {
  const [structure, setStructure] = useState<StructureSubject[]>([]);
  const [status, setStatus] = useState('loading');
  const [isDirty, setIsDirty] = useState(false);
  const [stagedTopicChanges, setStagedTopicChanges] = useState<StagedTopic[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const { t, i18n } = useTranslation();
  const { userPermissions } = useSession();
  const { taxonomyVersion } = useTaxonomyVersion();

  useEffect(() => {
    (async () => {
      try {
        const subjects = await fetchSubjects({ language: i18n.language, taxonomyVersion });

        const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);
        const activeTopics = taxonomy.topics.filter(t => t.path) ?? [];
        const sortedTopics = activeTopics.sort((a, b) => (a.id < b.id ? -1 : 1));

        const topicConnections = await Promise.all(
          sortedTopics.map(topic => fetchTopicConnections({ id: topic.id, taxonomyVersion })),
        );

        const topicsWithConnections = sortedTopics.map(async (topic, index) => {
          const breadcrumb = await getBreadcrumbFromPath(
            topic.path,
            taxonomyVersion,
            i18n.language,
          );
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
  }, [i18n.language, taxonomy, taxonomyVersion]);

  const getSubjectTopics = async (subjectId: string, locale: LocaleType) => {
    if (structure.some(subject => subject.id === subjectId && subject.topics)) {
      return;
    }
    try {
      updateSubject(subjectId);
      const allTopics = await fetchSubjectTopics({
        subject: subjectId,
        language: locale,
        taxonomyVersion,
      });
      const groupedTopics = groupTopics(allTopics);
      updateSubject(subjectId, { topics: groupedTopics });
    } catch (e) {
      handleError(e);
    }
  };

  const stageTaxonomyChanges = async ({ path, locale }: { path: string; locale?: LocaleType }) => {
    if (path) {
      const breadcrumb = await getBreadcrumbFromPath(path, taxonomyVersion, locale);
      const newTopic: StagedTopic = {
        id: 'staged',
        name: article.title?.title ?? '',
        path: `${path}/staged`,
        breadcrumb,
        metadata: {
          grepCodes: [],
          visible: false,
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
    setStatus('loading');

    const stagedNewTopics = stagedTopicChanges.filter(topic => topic.id === 'staged');
    try {
      if (stagedNewTopics.length > 0) {
        await addNewTopic(stagedNewTopics, i18n.language);
      }

      updateNotes({
        revision: article.revision,
        language: article.title?.language,
        notes: ['Oppdatert taksonomi.'],
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
      body: {
        name: topic.name,
        contentUri: `urn:article:${articleId}`,
      },
      taxonomyVersion,
    });

    const paths = pathToUrnArray(topic.path);
    const newTopicId = newTopicPath.split('/').pop() ?? '';

    if (paths.length > 2) {
      // we are placing it under a topic
      const parentTopicId = paths.slice(-2)[0];
      await addTopicToTopic({
        body: {
          subtopicid: newTopicId,
          topicid: parentTopicId,
        },
        taxonomyVersion,
      });
    } else {
      // we are placing it under a subject
      await addSubjectTopic({
        body: {
          topicid: newTopicId,
          subjectid: paths[0],
        },
        taxonomyVersion,
      });
    }
    if (!topic.metadata.visible) {
      await updateTopicMetadata({
        topicId: newTopicId,
        body: { visible: topic.metadata.visible },
        taxonomyVersion,
      });
    }
    const newPath = topic.path.replace('staged', newTopicId.replace('urn:', ''));
    const breadcrumb = await getBreadcrumbFromPath(newPath, taxonomyVersion, locale);
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

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

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
