/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import AlertModal from '../../../../components/AlertModal';
import { fetchTopic, queryTopics } from '../../../../modules/taxonomy';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import MenuItemButton from './MenuItemButton';
import { StyledErrorMessage } from '../styles';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { ARCHIVED } from '../../../../util/constants/ArticleStatus';
import { EditMode } from '../../../../interfaces';
import {
  useDeleteSubTopicConnection,
  useDeleteTopic,
  useDeleteTopicConnection,
  useTopicConnections,
} from '../../../../modules/taxonomy/topics/topicQueries';
import { SUBJECT_TOPICS_WITH_ARTICLE_TYPE, TOPIC_CONNECTIONS } from '../../../../queryKeys';

interface Props {
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  parent?: string;
  id: string;
  locale: string;
  subjectId: string;
}

const DeleteTopic = ({ toggleEditMode, parent, id, locale, editMode, subjectId }: Props) => {
  const { t } = useTranslation();

  const {
    data: connections,
    isLoading: topicConnectionsLoading,
    error: connectionError,
  } = useTopicConnections(id);
  const {
    mutateAsync: deleteSubTopicConnection,
    isLoading: deleteSubTopicLoading,
    error: deleteSubTopicError,
  } = useDeleteSubTopicConnection();
  const {
    mutateAsync: deleteTopicConnection,
    isLoading: deleteTopicsLoading,
    error: deleteTopicsError,
  } = useDeleteTopicConnection();
  const { mutateAsync: deleteTopic } = useDeleteTopic();

  const loading = topicConnectionsLoading || deleteSubTopicLoading || deleteTopicsLoading;
  const error = connectionError ?? deleteSubTopicError ?? deleteTopicsError;

  const qc = useQueryClient();

  const onDeleteTopic = async () => {
    toggleEditMode('deleteTopic');
    const subTopic = parent?.includes('topic');
    const deleteConnectionFunc = subTopic ? deleteSubTopicConnection : deleteTopicConnection;
    try {
      await deleteConnectionFunc(connections![0].connectionId, {
        onSettled: () => {
          qc.invalidateQueries([SUBJECT_TOPICS_WITH_ARTICLE_TYPE, subjectId]);
          qc.invalidateQueries([TOPIC_CONNECTIONS]);
        },
      });
      await setTopicArticleArchived(id, locale);
      await deleteTopic(id);
    } catch (err) {
      handleError(err);
    }
  };

  const toggleEditModes = () => {
    toggleEditMode('deleteTopic');
  };

  const setTopicArticleArchived = async (topicId: string, locale: string) => {
    let article = await fetchTopic(topicId, locale);
    let articleId = article.contentUri.split(':')[2];
    const topics = await queryTopics(articleId, locale);
    if (topics.length === 1) {
      await updateStatusDraft(parseInt(articleId), ARCHIVED);
    }
  };

  const isDisabled = connections && connections.length > 1;
  return (
    <>
      <MenuItemButton stripped disabled={isDisabled} onClick={toggleEditModes}>
        <RoundIcon small icon={<DeleteForever />} />
        {t('alertModal.delete')}
      </MenuItemButton>
      <AlertModal
        show={editMode === 'deleteTopic'}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleEditModes,
          },
          {
            text: t('alertModal.delete'),
            onClick: onDeleteTopic,
          },
        ]}
        onCancel={toggleEditModes}
        text={t('taxonomy.confirmDeleteTopic')}
      />

      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">
          {/* @ts-ignore */}
          {`${t('taxonomy.errorMessage')}: ${error.message}`}
        </StyledErrorMessage>
      )}
    </>
  );
};

export default DeleteTopic;
