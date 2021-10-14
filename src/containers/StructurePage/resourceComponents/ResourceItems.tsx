/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { partition, sortBy, uniqBy } from 'lodash';
import styled from '@emotion/styled';
import Resource from './Resource';
import { updateTopicSubtopic, updateSubjectTopic } from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import Spinner from '../../../components/Spinner';
import { TopicResource } from './StructureResources';
import { classes } from './ResourceGroup';
import { LocaleType } from '../../../interfaces';
import {
  useDeleteTopicResourceMutation,
  useUpdateTopicResource,
} from '../../../modules/taxonomy/topics/topicQueries';
import { TOPIC_RESOURCES } from '../../../queryKeys';

const StyledResourceItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledErrorMessage = styled.div`
  text-align: center;
`;

interface Props {
  resources: TopicResource[];
  locale: LocaleType;
  currentTopicId: string;
}

const ResourceItems = ({ resources, locale, currentTopicId }: Props) => {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string>('');

  const qc = useQueryClient();
  const {
    mutateAsync: deleteTopicResource,
    error,
    isLoading: loading,
  } = useDeleteTopicResourceMutation();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries([TOPIC_RESOURCES, resources[0].topicId, locale]);
    const [toUpdate, other] = partition(resources, t => t.connectionId === id);
    const updatedRes: TopicResource = { ...toUpdate[0], rank: newRank };
    const prevData =
      qc.getQueryData<TopicResource[]>([TOPIC_RESOURCES, updatedRes.topicId, locale, undefined]) ??
      [];
    const updated = other.map(t => (t.rank >= updatedRes.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedRes], 'rank');
    const allResources = uniqBy<TopicResource>([...newArr, ...prevData], 'id');
    qc.setQueryData<TopicResource[]>(
      [TOPIC_RESOURCES, updatedRes.topicId, locale, undefined],
      allResources,
    );
    return resources;
  };

  const { mutateAsync: updateTopicResource } = useUpdateTopicResource({
    onMutate: data => onUpdateRank(data.id, data.body.rank as number),
    onError: e => handleError(e),
    onSuccess: () => qc.invalidateQueries([TOPIC_RESOURCES]),
  });

  const onDelete = async (deleteId: string) => {
    setDeleteId('');
    await deleteTopicResource(deleteId, {
      onSuccess: () => qc.invalidateQueries(TOPIC_RESOURCES),
    });
  };

  const onDragEnd = async ({
    destination,
    source,
  }: {
    destination?: { index: number };
    source: { index: number };
  }) => {
    if (!destination) {
      return;
    }
    const { connectionId, primary, relevanceId, rank: currentRank } = resources[source.index];
    const { rank } = resources[destination.index];
    if (currentRank === rank) {
      return;
    }
    await updateTopicResource({
      id: connectionId,
      body: {
        primary,
        rank: currentRank > rank ? rank : rank + 1,
        relevanceId,
      },
    });
  };

  const toggleDelete = (newDeleteId: string) => {
    setDeleteId(newDeleteId);
  };

  const updateRelevanceId = async (
    connectionId: string,
    body: {
      primary?: boolean;
      rank?: number;
      relevanceId?: string;
    },
  ) => {
    const [, connectionType] = connectionId.split(':');
    switch (connectionType) {
      case 'topic-resource':
        updateTopicResource({ id: connectionId, body });
        break;
      case 'topic-subtopic':
        updateTopicSubtopic(connectionId, body);
        break;
      case 'subject-topic':
        updateSubjectTopic(connectionId, { ...body, rank: body.rank! });
        break;
      default:
        return;
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <StyledResourceItems {...classes('list')}>
      <MakeDndList onDragEnd={onDragEnd} dragHandle disableDnd={false}>
        {resources.map(resource => (
          <Resource
            {...resource}
            resource={resource}
            key={resource.id}
            onDelete={toggleDelete}
            locale={locale}
            updateRelevanceId={updateRelevanceId}
          />
        ))}
      </MakeDndList>
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage" {...classes('errorMessage')}>
          {/* @ts-ignore */}
          {`${t('taxonomy.errorMessage')}: ${e.message}`}
        </StyledErrorMessage>
      )}
      <AlertModal
        show={!!deleteId}
        text={t('taxonomy.resource.confirmDelete')}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => toggleDelete(''),
          },
          {
            text: t('alertModal.delete'),
            onClick: () => onDelete(deleteId!),
          },
        ]}
        onCancel={() => toggleDelete('')}
      />
    </StyledResourceItems>
  );
};

export default memo(ResourceItems);
