/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import AlertModal from '../../../../components/AlertModal';
import {
  deleteTopic,
  fetchTopicConnections,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../../modules/taxonomy';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import MenuItemButton from './MenuItemButton';
import { StyledErrorMessage } from './MenuItemEditField';

class DeleteTopic extends PureComponent {
  constructor() {
    super();
    this.state = { loading: false, error: '' };
    this.onDeleteTopic = this.onDeleteTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onDeleteTopic() {
    const { parent, toggleEditMode, refreshTopics, t, id } = this.props;
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

  render() {
    const { t, editMode } = this.props;
    const { error, loading } = this.state;
    return (
      <React.Fragment>
        <MenuItemButton stripped onClick={this.toggleEditMode}>
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
        {loading && (
          <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />
        )}
        {error && (
          <StyledErrorMessage data-testid="inlineEditErrorMessage">
            {error}
          </StyledErrorMessage>
        )}
      </React.Fragment>
    );
  }
}

DeleteTopic.propTypes = {
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  parent: PropTypes.string,
  id: PropTypes.string,
  refreshTopics: PropTypes.func.isRequired,
};

export default injectT(DeleteTopic);
