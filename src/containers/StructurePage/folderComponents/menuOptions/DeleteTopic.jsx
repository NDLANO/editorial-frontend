import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DeleteForever } from '@ndla/icons/editor';
import Button from 'ndla-button';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import WarningModal from '../../../../components/WarningModal';
import {
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../../modules/taxonomy';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';

class DeleteTopic extends PureComponent {
  constructor() {
    super();
    this.state = {};
    this.onDeleteTopic = this.onDeleteTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onDeleteTopic() {
    const {
      parent,
      toggleEditMode,
      connectionId,
      refreshTopics,
      t,
    } = this.props;
    toggleEditMode('deleteTopic');
    this.setState({ loading: true, error: '' });
    const subTopic = parent.includes('topic');
    try {
      if (subTopic) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
      refreshTopics();
      this.setState({ loading: false });
    } catch (e) {
      this.setState({
        loading: false,
        error: `${t('taxonomy.errorMessage')}: ${e.message}`,
      });
      handleError(e);
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('deleteTopic');
  }

  render() {
    const { t, classes, editMode } = this.props;
    const { error, loading } = this.state;
    return (
      <React.Fragment>
        <Button {...classes('menuItem')} stripped onClick={this.toggleEditMode}>
          <RoundIcon small icon={<DeleteForever />} />
          {t('warningModal.delete')}
        </Button>

        <WarningModal
          show={editMode === 'deleteTopic'}
          actions={[
            {
              text: t('form.abort'),
              onClick: this.toggleEditMode,
            },
            {
              text: t('warningModal.delete'),
              'data-testid': 'confirmDelete',
              onClick: this.onDeleteTopic,
            },
          ]}
          onCancel={this.toggleEditMode}
          text={t('taxonomy.confirmDeleteTopic')}
        />

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

DeleteTopic.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
};

export default DeleteTopic;
