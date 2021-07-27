/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Resource from './Resource';
import {
  deleteTopicResource,
  updateTopicResource,
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import Spinner from '../../../components/Spinner';
import { TopicResource } from './StructureResources';
import { classes } from './ResourceGroup';

interface Props {
  resources: TopicResource[];
  refreshResources: () => Promise<void>;
  locale: string;
}

const ResourceItems = ({ refreshResources, resources, locale, t }: Props & tType) => {
  const [deleteId, setDeleteId] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  const onDelete = async (deleteId: string) => {
    try {
      setDeleteId('');
      setError('');
      await deleteTopicResource(deleteId);
      refreshResources();
    } catch (e) {
      handleError(e);
      setError(`${t('taxonomy.errorMessage')}: ${e.message}`);
    }
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
    try {
      const { connectionId, primary, relevanceId, rank: currentRank } = resources[source.index];
      const { rank } = resources[destination.index];
      if (currentRank === rank) {
        return;
      }

      setLoading(true);
      await updateTopicResource(connectionId, {
        primary,
        rank: currentRank > rank ? rank : rank + 1,
        relevanceId,
      });
      await refreshResources();
    } catch (e) {
      handleError(e.message);
    }
    setLoading(false);
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
        updateTopicResource(connectionId, body);
        break;
      case 'topic-subtopic':
        updateTopicSubtopic(connectionId, body);
        break;
      case 'subject-topic':
        updateSubjectTopic(connectionId, { ...body, rank: body.rank });
        break;
      default:
        return;
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <ul {...classes('list')}>
      <MakeDndList onDragEnd={onDragEnd} dragHandle>
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
        <div data-testid="inlineEditErrorMessage" {...classes('errorMessage')}>
          {error}
        </div>
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
    </ul>
  );
};

export default memo(injectT(ResourceItems));
