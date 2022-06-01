/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Resource from './Resource';
import {
  deleteTopicResource,
  updateSubjectTopic,
  updateTopicResource,
  updateTopicSubtopic,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import Spinner from '../../../components/Spinner';
import { TopicResource } from './StructureResources';
import { LocaleType } from '../../../interfaces';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const StyledResourceItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledErrorMessage = styled.div`
  text-align: center;
  color: #fe5f55;
`;

interface Props {
  resources: TopicResource[];
  onDeleteResource: (resourceId: string) => void;
  refreshResources: () => Promise<void>;
  locale: LocaleType;
  onUpdateResource: (resource: TopicResource) => void;
}

const ResourceItems = ({
  refreshResources,
  resources,
  locale,
  onUpdateResource,
  onDeleteResource,
}: Props) => {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { taxonomyVersion } = useTaxonomyVersion();

  const onDelete = async (deleteId: string) => {
    try {
      setDeleteId('');
      setError('');
      await deleteTopicResource({ id: deleteId, taxonomyVersion });
      onDeleteResource(deleteId);
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
      await updateTopicResource({
        id: connectionId,
        body: {
          primary,
          rank: currentRank > rank ? rank : rank + 1,
          relevanceId,
        },
        taxonomyVersion,
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
        updateTopicResource({ id: connectionId, body, taxonomyVersion });
        break;
      case 'topic-subtopic':
        updateTopicSubtopic({ connectionId, body, taxonomyVersion });
        break;
      case 'subject-topic':
        updateSubjectTopic({ connectionId, body: { ...body, rank: body.rank! }, taxonomyVersion });
        break;
      default:
        return;
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <StyledResourceItems>
      <MakeDndList onDragEnd={onDragEnd} dragHandle disableDnd={false}>
        {resources.map(resource => (
          <Resource
            updateResource={onUpdateResource}
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
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
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
