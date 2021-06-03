/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { ResourceShape } from '../../../shapes';
import Resource from './Resource';
import { deleteTopicResource, updateTopicResource } from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import { classes } from './ResourceGroup';
import Spinner from '../../../components/Spinner';

class ResourceItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      filterPickerId: '',
    };
    this.onDelete = this.onDelete.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async onDelete(deleteId) {
    try {
      this.setState({ deleteId: '', error: '' });
      await deleteTopicResource(deleteId);
      this.props.refreshResources();
    } catch (e) {
      handleError(e);
      this.setState({
        error: `${this.props.t('taxonomy.errorMessage')}: ${e.message}`,
      });
    }
  }

  async onDragEnd({ destination, source }) {
    if (!destination) {
      return;
    }
    try {
      const { resources, refreshResources } = this.props;
      const { connectionId, primary, rank: currentRank } = resources[source.index];
      const { rank } = resources[destination.index];
      if (currentRank === rank) {
        return;
      }

      this.setState({ loading: true });
      await updateTopicResource(connectionId, {
        rank: currentRank > rank ? rank : rank + 1,
        primary,
      });
      await refreshResources();
      this.setState({ loading: false });
    } catch (e) {
      handleError(e.message);
    }
  }

  toggleDelete(deleteId) {
    this.setState({ deleteId });
  }

  render() {
    const { contentType, resources, t, currentSubject, locale } = this.props;

    const { deleteId, error, filterPickerId, loading } = this.state;

    if (loading) {
      return <Spinner />;
    }
    return (
      <ul {...classes('list')}>
        <MakeDndList onDragEnd={this.onDragEnd} disableDnd={!!filterPickerId} dragHandle>
          {resources.map(resource => (
            <Resource
              key={resource.id}
              contentType={contentType}
              currentSubject={currentSubject}
              onDelete={this.toggleDelete}
              {...resource}
              locale={locale}
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
              onClick: () => this.toggleDelete(''),
            },
            {
              text: t('alertModal.delete'),
              onClick: () => this.onDelete(deleteId),
            },
          ]}
          onCancel={() => this.toggleDelete('')}
        />
      </ul>
    );
  }
}

ResourceItems.propTypes = {
  contentType: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
  classes: PropTypes.func,
  refreshResources: PropTypes.func.isRequired,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  locale: PropTypes.string,
};

export default injectT(ResourceItems);
