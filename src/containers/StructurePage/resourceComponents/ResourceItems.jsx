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
import {
  deleteTopicResource,
  updateTopicResource,
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import { classes } from './ResourceGroup';
import Spinner from '../../../components/Spinner';
import { StructureShape } from '../../../shapes';

class ResourceItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
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
      const { connectionId, primary, relevanceId, rank: currentRank } = resources[source.index];
      const { rank } = resources[destination.index];
      if (currentRank === rank) {
        return;
      }

      this.setState({ loading: true });
      await updateTopicResource(connectionId, {
        primary,
        rank: currentRank > rank ? rank : rank + 1,
        relevanceId,
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

  updateRelevanceId(connectionId, body) {
    const [, connectionType] = connectionId.split(':');
    switch (connectionType) {
      case 'topic-resource':
        updateTopicResource(connectionId, body);
        break;
      case 'topic-subtopic':
        updateTopicSubtopic(connectionId, body);
        break;
      case 'subject-topic':
        updateSubjectTopic(connectionId, body);
        break;
      default:
        return;
    }
  }

  render() {
    const { resources, t, currentSubject, structure, locale } = this.props;

    const { deleteId, error, loading } = this.state;

    if (loading) {
      return <Spinner />;
    }
    return (
      <ul {...classes('list')}>
        <MakeDndList onDragEnd={this.onDragEnd} dragHandle>
          {resources.map(resource => (
            <Resource
              resource={resource}
              key={resource.id}
              id={resource.id}
              currentSubject={currentSubject}
              structure={structure}
              onDelete={this.toggleDelete}
              locale={locale}
              updateRelevanceId={this.updateRelevanceId}
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
  resources: PropTypes.arrayOf(ResourceShape),
  classes: PropTypes.func,
  refreshResources: PropTypes.func.isRequired,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  currentTopic: PropTypes.shape({}),
  structure: PropTypes.arrayOf(StructureShape),
  locale: PropTypes.string,
};

export default injectT(ResourceItems);
