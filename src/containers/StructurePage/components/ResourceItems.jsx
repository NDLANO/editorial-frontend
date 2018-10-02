/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { ResourceShape } from '../../../shapes';
import Resource from './Resource';
import {
  deleteTopicResource,
  fetchResourceFilter,
  updateResourceRelevance,
  updateTopicResource,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import WarningModal from '../../../components/WarningModal';
import { classes } from './ResourceGroup';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';

class ResourceItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
    this.onDelete = this.onDelete.bind(this);
    this.toggleRelevance = this.toggleRelevance.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async onDelete(id) {
    try {
      this.setState({ deleteId: '' });
      await deleteTopicResource(id);
      this.props.refreshResources();
    } catch (e) {
      handleError(e);
      this.setState({
        error: `${this.props.t('taxonomy.errorMessage')}: ${e.message}`,
      });
    }
  }

  async onDragEnd({ destination, source }) {
    if (!destination) return;
    try {
      const { connectionId, isPrimary } = this.props.resources[source.index];
      const { rank } = this.props.resources[destination.index];
      await updateTopicResource(connectionId, {
        rank,
        primary: isPrimary,
      });
      this.props.refreshResources();
    } catch (e) {
      handleError(e.message);
    }
  }

  async toggleRelevance(resourceId, relevance) {
    const { activeFilter, locale, refreshResources } = this.props;
    const newRelevance =
      relevance === RESOURCE_FILTER_CORE
        ? RESOURCE_FILTER_SUPPLEMENTARY
        : RESOURCE_FILTER_CORE;
    const resourceFilters = await fetchResourceFilter(resourceId, locale);
    const fetchedFilter = resourceFilters.find(
      filter => filter.id === activeFilter,
    );
    const ok = fetchedFilter
      ? await updateResourceRelevance(fetchedFilter.connectionId, newRelevance)
      : false;

    if (ok) refreshResources();
  }

  toggleDelete(id) {
    this.setState({ deleteId: id });
  }

  render() {
    const { contentType, resources, t, activeFilter } = this.props;
    const { deleteId, error } = this.state;
    return (
      <ul {...classes('list')}>
        <MakeDndList onDragEnd={this.onDragEnd}>
          {resources.map(resource => (
            <Resource
              contentType={contentType}
              name={resource.name}
              id={resource.id}
              key={resource.id}
              onDelete={() => this.toggleDelete(resource.connectionId)}
              toggleRelevance={
                activeFilter
                  ? () => this.toggleRelevance(resource.id, resource.relevance)
                  : undefined
              }
              relevance={resource.relevance}
            />
          ))}
        </MakeDndList>
        {error && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {error}
          </div>
        )}
        <WarningModal
          show={!!deleteId}
          text={t('taxonomy.resource.confirmDelete')}
          actions={[
            {
              text: t('form.abort'),
              onClick: () => this.toggleDelete(''),
            },
            {
              text: t('warningModal.delete'),
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
  activeFilter: PropTypes.string,
};

export default injectT(ResourceItems);
