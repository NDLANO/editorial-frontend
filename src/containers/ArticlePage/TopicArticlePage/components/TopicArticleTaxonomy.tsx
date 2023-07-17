/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import partition from 'lodash/partition';
import { Spinner } from '@ndla/icons';
import { ErrorMessage } from '@ndla/ui';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import { SingleValue } from '@ndla/select';
import { useQueryClient } from '@tanstack/react-query';
import { Metadata } from '@ndla/types-taxonomy';
import isEqual from 'lodash/isEqual';
import {
  fetchSubjectTopics,
  addTopicToTopic,
  addSubjectTopic,
  addTopic,
  updateTopicMetadata,
} from '../../../../modules/taxonomy';
import {
  groupTopics,
  pathToUrnArray,
  getBreadcrumbFromPath,
} from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import SaveButton from '../../../../components/SaveButton';
import TopicArticleConnections from './TopicArticleConnections';

import { FormikFieldHelp } from '../../../../components/FormikField';
import { LocaleType } from '../../../../interfaces';
import {
  SubjectTopic,
  SubjectType,
  TaxonomyElement,
  TopicConnections,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { TAXONOMY_ADMIN_SCOPE } from '../../../../constants';
import { useSession } from '../../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import VersionSelect from '../../components/VersionSelect';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { useNodes } from '../../../../modules/nodes/nodeQueries';
import {
  SubjectWithTopics,
  TaxNode,
  toInitialResource,
} from '../../LearningResourcePage/components/LearningResourceTaxonomy';
import { useUpdateTaxonomyMutation } from '../../../../modules/taxonomy/taxonomyMutations';

type Props = {
  article: IArticle;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
};

export interface StagedTopic extends TaxonomyElement {
  id: string;
  name: string;
  path: string;
  paths?: string[];
  breadcrumb?: TaxonomyElement[];
  topicConnections?: TopicConnections[];
  relevanceId?: string;
  isPrimary?: boolean;
  metadata: Metadata;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
`;

const TopicArticleTaxonomy = ({ article, updateNotes, articleLanguage }: Props) => {
  const [status, setStatus] = useState('loading');
  const [stagedTopicChanges, setStagedTopicChanges] = useState<StagedTopic[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [subjects, setSubjects] = useState<SubjectWithTopics[]>([]);
  const { t, i18n } = useTranslation();
  const { userPermissions } = useSession();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data: versions } = useVersions();
  const qc = useQueryClient();

  const updateTaxMutation = useUpdateTaxonomyMutation();

  const [workingResource, setWorkingResource] = useState<TaxNode>(
    toInitialResource(undefined, i18n.language),
  );

  const nodesQuery = useNodes(
    {
      language: i18n.language,
      contentURI: `urn:article:${article.id}`,
      taxonomyVersion,
      includeContexts: true,
    },
    {
      onSuccess: (data) => setWorkingResource(toInitialResource(data?.[0], articleLanguage)),
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

  const isDirty = useMemo(
    () => !isEqual(initialResource, workingResource),
    [initialResource, workingResource],
  );

  const addTopicsToSubject = useCallback((subjectId: string, topics: SubjectTopic[]) => {
    setSubjects((subjects) => subjects.map((s) => (s.id === subjectId ? { ...s, topics } : s)));
  }, []);

  const getSubjectTopics = useCallback(
    async (subjectId: string, locale: LocaleType) => {
      if (subjects.some((subject) => subject.id === subjectId && subject.topics)) {
        return;
      }
      try {
        const allTopics = await fetchSubjectTopics({
          subject: subjectId,
          language: locale,
          taxonomyVersion,
        });
        const groupedTopics = groupTopics(allTopics);
        addTopicsToSubject(subjectId, groupedTopics);
      } catch (e) {
        handleError(e);
      }
    },
    [addTopicsToSubject, subjects, taxonomyVersion],
  );

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
      setStagedTopicChanges((prev) => [...prev, newTopic]);
    }
  };

  const addNewTopic = async (stagedNewTopics: StagedTopic[], locale?: LocaleType) => {
    const existingTopics = stagedTopicChanges.filter((t) => !stagedNewTopics.includes(t));
    const newTopics = await Promise.all(
      stagedNewTopics.map((topic) => createAndPlaceTopic(topic, article.id, locale)),
    );
    setIsDirty(false);
    setStagedTopicChanges(existingTopics.concat(newTopics));
    setStatus('success');
  };

  const handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setStatus('loading');

    const stagedNewTopics = stagedTopicChanges.filter((topic) => topic.id === 'staged');
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

  const onVersionChanged = (newVersion: SingleValue) => {
    if (!newVersion || newVersion.value === taxonomyVersion) return;
    const oldVersion = taxonomyVersion;
    try {
      setStatus('loading');
      setIsDirty(false);
      changeVersion(newVersion.value);
      qc.removeQueries({
        predicate: (query) => {
          const qk = query.queryKey as [string, Record<string, any>];
          return qk[1]?.taxonomyVersion === oldVersion;
        },
      });
    } catch (e) {
      handleError(e);
      setStatus('error');
    }
  };

  // if (status === 'loading') {
  //   return <Spinner />;
  // }
  if (status === 'error') {
    changeVersion('');
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
        <>
          <TaxonomyConnectionErrors
            articleType={article.articleType ?? 'topic-article'}
            resources={resources}
            topics={topics}
          />
          <VersionSelect versions={versions ?? []} onVersionChanged={onVersionChanged} />
        </>
      )}
      <TopicArticleConnections
        structure={subjects}
        activeTopics={topics}
        getSubjectTopics={getSubjectTopics}
        stageTaxonomyChanges={stageTaxonomyChanges}
      />
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <ButtonContainer>
        <ButtonV2 variant="outline" onClick={onReset} disabled={status === 'loading'}>
          {t('reset')}
        </ButtonV2>
        <SaveButton
          formIsDirty={isDirty}
          isSaving={status === 'loading'}
          showSaved={status === 'success' && !isDirty}
          disabled={!isDirty}
          onClick={handleSubmit}
          defaultText="saveTax"
        />
      </ButtonContainer>
    </>
  );
};

export default TopicArticleTaxonomy;
