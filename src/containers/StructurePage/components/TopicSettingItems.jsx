import React from 'react';
import PropTypes from 'prop-types';
import { Pencil, Plus } from 'ndla-icons/action';
import { injectT } from 'ndla-i18n';
import { Filter, DeleteForever } from 'ndla-icons/editor';
import { Button } from 'ndla-ui';
import InlineEditField from './InlineEditField';
import InlineDropdown from './InlineDropdown';
import ConnectFilters from './ConnectFilters';
import RoundIcon from './RoundIcon';
import WarningModal from '../../../components/WarningModal';
import {
  fetchTopics,
  addTopic,
  updateTopicName,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../modules/taxonomy';
import Spinner from '../../../components/Spinner';

class TopicSettingItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      editMode: '',
    };
    this.onChangeTopicName = this.onChangeTopicName.bind(this);
    this.onAddSubTopic = this.onAddSubTopic.bind(this);
    this.onAddExistingSubTopic = this.onAddExistingSubTopic.bind(this);
    this.onDeleteTopic = this.onDeleteTopic.bind(this);
  }

  async onChangeTopicName(id, newName) {
    try {
      await updateTopicName(id, newName);
      this.props.refreshTopics();
    } catch (e) {
      console.log(e);
    }
  }

  async onAddSubTopic(currentTopicId, name) {
    try {
      const newPath = await addTopic({ name });
      const newId = newPath.replace('/v1/topics/', '');
      await addTopicToTopic({
        subtopicid: newId,
        topicid: currentTopicId,
        primary: true,
      });
      this.props.refreshTopics();
    } catch (e) {
      console.log(e);
    }
  }

  async onAddExistingSubTopic(currentTopicId, subTopicId) {
    try {
      await addTopicToTopic({
        subtopicid: subTopicId,
        topicid: currentTopicId,
      });
      this.props.refreshTopics();
    } catch (e) {
      console.log(e);
    }
  }

  async onDeleteTopic() {
    this.setState({ editMode: '', loading: true });
    const { parent, connectionId } = this.props;
    const subTopic = parent.includes('topic');
    try {
      if (subTopic) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
      this.props.refreshTopics();
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { classes, id, name, onClose, t, path } = this.props;
    const { editMode } = this.state;

    return (
      <React.Fragment>
        {editMode === 'changeName' ? (
          <InlineEditField
            classes={classes}
            currentVal={name}
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            onSubmit={e => this.onChangeTopicName(id, e)}
            onClose={onClose}
            icon={<Pencil />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            onClick={() => this.setState({ editMode: 'changeName' })}>
            <RoundIcon small icon={<Pencil />} />
            {t('taxonomy.changeName')}
          </Button>
        )}
        {editMode === 'addTopic' ? (
          <InlineEditField
            classes={classes}
            currentVal=""
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            onClose={onClose}
            onSubmit={e => this.onAddSubTopic(id, e)}
            icon={<Plus />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            onClick={() => this.setState({ editMode: 'addTopic' })}>
            <RoundIcon small icon={<Plus />} />
            {t('taxonomy.addTopic')}
          </Button>
        )}
        {editMode === 'addExistingTopic' ? (
          <InlineDropdown
            fetchItems={() => fetchTopics('nb')}
            classes={classes}
            onClose={onClose}
            onSubmit={e => this.onAddExistingSubTopic(id, e)}
            icon={<Plus />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            onClick={() => this.setState({ editMode: 'addExistingTopic' })}>
            <RoundIcon small icon={<Plus />} />
            {t('taxonomy.addExistingTopic')}
          </Button>
        )}
        <Button
          {...classes('menuItem')}
          stripped
          onClick={() =>
            this.setState(prevState => ({
              editMode:
                prevState.editMode === 'connectFilters' ? '' : 'connectFilters',
            }))
          }>
          <RoundIcon
            small
            open={editMode === 'connectFilters'}
            icon={<Filter />}
          />
          {t('taxonomy.connectFilters')}
        </Button>
        {editMode === 'connectFilters' && (
          <ConnectFilters
            classes={classes}
            topicFilters={this.props.filters}
            path={path}
          />
        )}
        <Button
          {...classes('menuItem')}
          stripped
          onClick={() => this.setState({ editMode: 'delete' })}>
          <RoundIcon small icon={<DeleteForever />} />
          {this.state.loading ? (
            <Spinner cssModifier="small" />
          ) : (
            t('warningModal.delete')
          )}
        </Button>
        {editMode === 'delete' && (
          <WarningModal
            confirmDelete
            onContinue={() => this.onDeleteTopic(id)}
            onCancel={() => this.setState({ editMode: '' })}
            text={t('taxonomy.confirmDeleteTopic')}
          />
        )}
      </React.Fragment>
    );
  }
}

TopicSettingItems.propTypes = {
  classes: PropTypes.func,
  onChangeTopicName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func,
  t: PropTypes.func,
  onDeleteTopic: PropTypes.func,
  refreshTopics: PropTypes.func,
};

export default injectT(TopicSettingItems);
