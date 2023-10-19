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
import { ErrorMessage } from '@ndla/ui';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import { SingleValue } from '@ndla/select';
import { useQueryClient } from '@tanstack/react-query';
import { Node } from '@ndla/types-taxonomy';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import differenceBy from 'lodash/differenceBy';
import { groupChildNodes } from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import SaveButton from '../../../../components/SaveButton';
import TopicArticleConnections from './TopicArticleConnections';

import { FormikFieldHelp } from '../../../../components/FormikField';
import TaxonomyConnectionErrors from '../../components/TaxonomyConnectionErrors';
import { TAXONOMY_ADMIN_SCOPE } from '../../../../constants';
import { useSession } from '../../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import VersionSelect from '../../components/VersionSelect';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { nodeQueryKeys, useNodes } from '../../../../modules/nodes/nodeQueries';
import { fetchChildNodes } from '../../../../modules/nodes/nodeApi';
import { NodeWithChildren } from '../../../../components/Taxonomy/TaxonomyBlockNode';
import { useCreateTopicNodeConnectionsMutation } from '../../../../modules/taxonomy/taxonomyMutations';

type Props = {
  article: IArticle;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
  hasTaxEntries: boolean;
};

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

const partitionByValidity = (nodes: Node[]) => {
  const [validPlacements, invalidPlacements] = nodes.reduce<[Node[], Node[]]>(
    (acc, curr) => {
      if (curr.breadcrumbs?.length) {
        acc[0].push(curr);
      } else {
        acc[1].push(curr);
      }
      return acc;
    },
    [[], []],
  );

  return [validPlacements, invalidPlacements];
};

const TopicArticleTaxonomy = ({ article, updateNotes, articleLanguage, hasTaxEntries }: Props) => {
  const [status, setStatus] = useState('loading');
  const [showWarning, setShowWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState<NodeWithChildren[]>([]);
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data: versions } = useVersions();
  const qc = useQueryClient();

  useNodes(
    { language: articleLanguage, taxonomyVersion, nodeType: 'SUBJECT' },
    {
      select: (subject) =>
        sortBy(
          subject.filter((s) => !!s.name),
          (s) => s.name,
        ),
      onSuccess: (data) => setSubjects(data),
    },
  );

  const [placements, setPlacements] = useState<Node[]>([]);
  const [invalidPlacements, setInvalidPlacements] = useState<Node[]>([]);

  const createTopicNodeConnectionsMutation = useCreateTopicNodeConnectionsMutation();

  const nodesQuery = useNodes(
    {
      language: articleLanguage,
      contentURI: `urn:article:${article.id}`,
      taxonomyVersion,
      includeContexts: true,
    },
    {
      onSuccess: (data) => {
        const [validPlacements, invalidPlacements] = partitionByValidity(data);
        setPlacements(validPlacements);
        setInvalidPlacements(invalidPlacements);
      },
    },
  );

  const initialPlacements: Node[] = useMemo(
    () => JSON.parse(JSON.stringify(partitionByValidity(nodesQuery.data ?? [])[0])),
    [nodesQuery.data],
  );

  const [resources, topics] = useMemo(
    () => partition(nodesQuery.data, (node) => node.nodeType === 'RESOURCE'),
    [nodesQuery.data],
  );

  const isDirty = useMemo(
    () => !isEqual(initialPlacements, placements),
    [initialPlacements, placements],
  );

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
    [articleLanguage, subjects, taxonomyVersion],
  );

  const addConnection = useCallback((node: Node) => {
    setPlacements((placements) => placements.concat(node));
  }, []);

  const handleSubmit = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setIsSaving(true);
    const newNodes = differenceBy(placements, initialPlacements, (p) => p.id);
    if (!newNodes.length) return;
    try {
      await createTopicNodeConnectionsMutation.mutateAsync({
        placements: newNodes,
        name: article.title?.title ?? '',
        articleId: article.id,
        taxonomyVersion,
      });
      await updateNotes({
        revision: article.revision,
        language: article.title?.language,
        notes: ['Oppdatert taksonomi.'],
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
          nodeType: 'SUBJECT',
        }),
      });
    } catch (err) {
      handleError(err);
      setStatus('error');
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
      changeVersion('draft');
    }
  }, [changeVersion, initialPlacements, isDirty, showWarning]);

  const onVersionChanged = useCallback(
    (newVersion: SingleValue) => {
      if (!newVersion || newVersion.value === taxonomyVersion) return;
      const oldVersion = taxonomyVersion;
      changeVersion(newVersion.value);
      setShowWarning(false);
      qc.removeQueries({
        predicate: (query) => {
          const qk = query.queryKey as [string, Record<string, any>];
          return qk[1]?.taxonomyVersion === oldVersion;
        },
      });
    },
    [changeVersion, qc, taxonomyVersion],
  );

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
      {!hasTaxEntries && <FormikFieldHelp error>{t('errorMessage.missingTax')}</FormikFieldHelp>}
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
        addConnection={addConnection}
        structure={subjects}
        selectedNodes={placements}
        getSubjectTopics={getSubjectTopics}
      />
      {!!invalidPlacements.length && isTaxonomyAdmin && (
        <details>
          <summary>{t('errorMessage.invalidTopicPlacements')}</summary>
          <InvalidPlacementsWrapper>
            {invalidPlacements.map((placement) => (
              <InvalidPlacement key={placement.id}>{placement.id}</InvalidPlacement>
            ))}
          </InvalidPlacementsWrapper>
        </details>
      )}
      {showWarning && <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>}
      <ButtonContainer>
        <ButtonV2
          variant="outline"
          onClick={onReset}
          disabled={!isDirty || createTopicNodeConnectionsMutation.isLoading}
        >
          {t('reset')}
        </ButtonV2>
        <SaveButton
          isSaving={isSaving}
          showSaved={createTopicNodeConnectionsMutation.isSuccess && !isDirty}
          disabled={!isDirty || nodesQuery.isFetching}
          onClick={handleSubmit}
          defaultText="saveTax"
          formIsDirty={isDirty}
        />
      </ButtonContainer>
      <FormikFieldHelp float="right" warning>
        {t('warningMessage.taxonomy')}
      </FormikFieldHelp>
    </>
  );
};

export default TopicArticleTaxonomy;
