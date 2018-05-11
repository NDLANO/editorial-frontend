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
import handleError from '../../../util/handleError';
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
import Overlay from '../../../components/Overlay';

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
    await updateTopicName(id, newName);
    this.props.refreshTopics();
  }

  async onAddSubTopic(currentTopicId, name) {
    const newPath = await addTopic({ name });
    const newId = newPath.replace('/v1/topics/', '');
    await addTopicToTopic({
      subtopicid: newId,
      topicid: currentTopicId,
      primary: true,
    });
    this.props.refreshTopics();
  }

  async onAddExistingSubTopic(currentTopicId, subTopicId) {
    await addTopicToTopic({
      subtopicid: subTopicId,
      topicid: currentTopicId,
    });
    this.props.refreshTopics();
  }

  async onDeleteTopic() {
    this.setState({ editMode: '', loading: true, error: '' });
    const { parent, connectionId, t } = this.props;
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
      this.setState({
        loading: false,
        error: `${t('taxonomy.errorMessage')}: ${e.message}`,
      });
      handleError(e);
    }
  }

  render() {
    const { classes, id, name, onClose, t, path, filters } = this.props;
    const { editMode, loading, error } = this.state;

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
            path={path}
            id={id}
            subjectFilters={filters}
          />
        )}
        <Button
          {...classes('menuItem')}
          stripped
          onClick={() => this.setState({ editMode: 'delete' })}>
          <RoundIcon small icon={<DeleteForever />} />
          {t('warningModal.delete')}
        </Button>
        {editMode === 'delete' && (
          <WarningModal
            confirmDelete
            onContinue={() => this.onDeleteTopic(id)}
            onCancel={() => this.setState({ editMode: '' })}
            text={t('taxonomy.confirmDeleteTopic')}
          />
        )}
        {loading && <Spinner cssModifier="absolute" />}
        {loading && (
          <Overlay cssModifiers={['absolute', 'white-opacity', 'zIndex']} />
        )}
        {error && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {error}
          </div>
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
  path: PropTypes.string,
  filters: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(TopicSettingItems);
