/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PureComponent } from 'react';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
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
import { EditMode } from '../../../../interfaces';

interface State {
  loading: boolean;
  error: string;
  connections?: TopicConnections[];
}

interface BaseProps {
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  parent?: string;
  id: string;
  refreshTopics: () => Promise<void>;
  locale: string;
  taxonomyVersion: string;
}

type Props = BaseProps & CustomWithTranslation;

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
    const { parent, toggleEditMode, refreshTopics, t, id, locale, taxonomyVersion } = this.props;
    toggleEditMode('deleteTopic');
    this.setState({ loading: true, error: '' });
    const subTopic = parent?.includes('topic');
    const [{ connectionId }] = await fetchTopicConnections({ id, taxonomyVersion });
    try {
      if (subTopic) {
        await deleteSubTopicConnection({ id: connectionId, taxonomyVersion });
      } else {
        await deleteTopicConnection({ id: connectionId, taxonomyVersion });
      }
      await this.setTopicArticleArchived(id, locale);
      await deleteTopic({ id, taxonomyVersion });
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
    const { id, taxonomyVersion } = this.props;
    const connections = await fetchTopicConnections({ id, taxonomyVersion });
    this.setState(prevState => ({
      ...prevState,
      connections,
    }));
  }

  async setTopicArticleArchived(topicId: string, locale: string) {
    const { taxonomyVersion } = this.props;
    let article = await fetchTopic({ id: topicId, language: locale, taxonomyVersion });
    let articleId = Number(article.contentUri.split(':')[2]);
    const topics = await queryTopics({ contentId: articleId, language: locale, taxonomyVersion });
    // Only topics with paths are relevant here.
    if (topics.filter(t => t.path).length === 0) {
      await updateStatusDraft(articleId, ARCHIVED);
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

export default withTranslation()(DeleteTopic);
