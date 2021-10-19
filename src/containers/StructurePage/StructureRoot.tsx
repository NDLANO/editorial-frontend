/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { partition, sortBy } from 'lodash';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import {
  useSubjectTopicsWithArticleType,
  useUpdateSubjectTopic,
} from '../../modules/taxonomy/subjects/subjectsQueries';
import { groupTopics } from '../../util/taxonomyHelpers';
import { SUBJECT_TOPICS_WITH_ARTICLE_TYPE } from '../../queryKeys';
import { useUpdateTopicSubTopic } from '../../modules/taxonomy/topics/topicQueries';
import StructureNode, { RenderBeforeFunction } from './StructureNode';

interface Props {
  subject: SubjectType;
  toggleOpen: (path: string) => void;
  openedPaths: string[];
  favoriteSubjectIds?: string[];
  toggleFavorite: () => void;
  locale: string;
  onTopicSelect: (topic?: SubjectTopic) => void;
  topicResourcesLoading: boolean;
  resourceSectionRef: React.MutableRefObject<HTMLDivElement | null>;
  allSubjects: SubjectType[];
  renderBeforeTitle?: RenderBeforeFunction;
}

const StructureRoot = ({
  favoriteSubjectIds,
  subject,
  openedPaths,
  toggleOpen,
  toggleFavorite,
  locale,
  onTopicSelect,
  topicResourcesLoading,
  resourceSectionRef,
  allSubjects,
  renderBeforeTitle,
}: Props) => {
  const { data: topicsData, isLoading } = useSubjectTopicsWithArticleType(subject.id, locale, {
    enabled: openedPaths[0] === subject.id,
    select: allTopics => groupTopics(allTopics),
  });
  const qc = useQueryClient();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries([SUBJECT_TOPICS_WITH_ARTICLE_TYPE, subject.id, locale]);
    const prevData = qc.getQueryData<SubjectTopic[]>([
      SUBJECT_TOPICS_WITH_ARTICLE_TYPE,
      subject.id,
      locale,
    ]);
    const [toUpdate, other] = partition(prevData, t => t.connectionId === id);
    const updatedTopic: SubjectTopic = { ...toUpdate[0], rank: newRank };
    const updated = other.map(t => (t.rank >= updatedTopic.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedTopic], 'rank');
    qc.setQueryData<SubjectTopic[]>([SUBJECT_TOPICS_WITH_ARTICLE_TYPE, subject.id, locale], newArr);
    return prevData;
  };
  const { mutateAsync: updateTopicSubtopic } = useUpdateTopicSubTopic({
    onMutate: data => onUpdateRank(data.id, data.body.rank!),
  });
  const { mutateAsync: updateSubjectTopic } = useUpdateSubjectTopic({
    onMutate: data => onUpdateRank(data.id, data.body.rank!),
  });

  const onDragEnd = async (
    { draggableId, source, destination }: DropResult,
    topics: SubjectTopic[],
  ) => {
    if (!destination) {
      return;
    }
    const currentRank = topics[source.index].rank;
    const destinationRank = topics[destination.index].rank;
    if (currentRank === destinationRank) return;
    const newRank = currentRank > destinationRank ? destinationRank : destinationRank + 1;
    const updateFunc = draggableId.includes('topic-subtopic')
      ? updateTopicSubtopic
      : updateSubjectTopic;
    await updateFunc(
      { id: draggableId, body: { rank: newRank } },
      {
        onSettled: () =>
          qc.invalidateQueries([SUBJECT_TOPICS_WITH_ARTICLE_TYPE, subject.id, locale]),
      },
    );
  };
  return (
    <StructureNode
      renderBeforeTitle={renderBeforeTitle}
      id={subject.id}
      item={subject}
      nodes={topicsData}
      openedPaths={openedPaths}
      locale={locale}
      level={1}
      onTopicSelect={onTopicSelect}
      toggleOpen={toggleOpen}
      toggleFavorite={toggleFavorite}
      path={subject.id}
      parent={''}
      subjectId={subject.id}
      topicResourcesLoading={topicResourcesLoading}
      resourceSectionRef={resourceSectionRef}
      onDragEnd={onDragEnd}
      connectionId={''}
      parentActive={true}
      allSubjects={allSubjects}
      isRoot={true}
      favoriteSubjectIds={favoriteSubjectIds}
      isLoading={isLoading}
    />
  );
};

export default StructureRoot;
