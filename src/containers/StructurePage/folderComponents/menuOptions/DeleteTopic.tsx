/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import AlertModal from '../../../../components/AlertModal';
import {
  deleteSubTopicConnection,
  deleteTopic,
  deleteTopicConnection,
  fetchTopic,
  fetchTopicConnections,
  queryTopics,
} from '../../../../modules/taxonomy';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import MenuItemButton from './MenuItemButton';
import { StyledErrorMessage } from '../styles';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { ARCHIVED } from '../../../../util/constants/ArticleStatus';
import { TopicConnections } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { EditMode } from '../SettingsMenu';

interface State {
  loading: boolean;
  error: string;
  connections?: TopicConnections[];
}

interface BaseProps {
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  parent: string;
  id: string;
  refreshTopics: () => Promise<void>;
  locale: string;
}

type Props = BaseProps & tType;

class DeleteTopic extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { loading: false, error: '' };
    this.onDeleteTopic = this.onDeleteTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.setTopicArticleArchived = this.setTopicArticleArchived.bind(this);
  }

  componentDidMount() {
    this.getConnections();
  }

  async onDeleteTopic() {
    const { parent, toggleEditMode, refreshTopics, t, id, locale } = this.props;
    toggleEditMode('deleteTopic');
    this.setState({ loading: true, error: '' });
    const subTopic = parent.includes('topic');
    const [{ connectionId }] = await fetchTopicConnections(id);
    try {
      if (subTopic) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
      await this.setTopicArticleArchived(id, locale);
      await deleteTopic(id);
      refreshTopics();
      this.setState({ loading: false });
    } catch (err) {
      this.setState({
        loading: false,
        error: `${t('taxonomy.errorMessage')}: ${err.message}`,
      });
      handleError(err);
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('deleteTopic');
  }

  async getConnections() {
    const { id } = this.props;
    const connections = await fetchTopicConnections(id);
    this.setState(prevState => ({
      ...prevState,
      connections,
    }));
  }

  async setTopicArticleArchived(topicId: string, locale: string) {
    let article = await fetchTopic(topicId, locale);
    let articleId = article.contentUri.split(':')[2];
    const topics = await queryTopics(articleId, locale);
    if (topics.length === 1) {
      await updateStatusDraft(parseInt(articleId), ARCHIVED);
    }
  }

  render() {
    const { t, editMode } = this.props;
    const { error, loading, connections } = this.state;
    const isDisabled = connections && connections.length > 1;
    return (
      <>
        <MenuItemButton stripped disabled={isDisabled} onClick={this.toggleEditMode}>
          <RoundIcon small icon={<DeleteForever />} />
          {t('alertModal.delete')}
        </MenuItemButton>
        <AlertModal
          show={editMode === 'deleteTopic'}
          actions={[
            {
              text: t('form.abort'),
              onClick: this.toggleEditMode,
            },
            {
              text: t('alertModal.delete'),
              'data-testid': 'confirmDelete',
              onClick: this.onDeleteTopic,
            },
          ]}
          onCancel={this.toggleEditMode}
          text={t('taxonomy.confirmDeleteTopic')}
        />

        {loading && <Spinner appearance="absolute" />}
        {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
        {error && (
          <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
        )}
      </>
    );
  }
}

export default injectT(DeleteTopic);
