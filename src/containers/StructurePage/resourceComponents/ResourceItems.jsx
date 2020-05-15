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
  fetchResourceFilter,
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  updateTopicResource,
} from '../../../modules/taxonomy';
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import MakeDndList from '../../../components/MakeDndList';
import AlertModal from '../../../components/AlertModal';
import { classes } from './ResourceGroup';
import Spinner from '../../../components/Spinner';
import { StructureShape, AvailableFiltersShape } from '../../../shapes';

class ResourceItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      activeFilters: {},
      filterPickerId: '',
    };
    this.onDelete = this.onDelete.bind(this);
    this.onFilterSubmit = this.onFilterSubmit.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.toggleFilterPicker = this.toggleFilterPicker.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async onDelete(deleteId, resourceId) {
    try {
      this.setState({ deleteId: '', error: '' });
      await deleteTopicResource(deleteId);
      await this.deleteFilters(resourceId);
      this.props.refreshResources();
    } catch (e) {
      handleError(e);
      this.setState({
        error: `${this.props.t('taxonomy.errorMessage')}: ${e.message}`,
      });
    }
  }

  async deleteFilters(id) {
    const resourceFilters = await fetchResourceFilter(id);
    const topicFilterIds = this.props.currentTopic.filters.map(
      filter => filter.id,
    );
    resourceFilters.forEach(resourceFilter => {
      if (topicFilterIds.includes(resourceFilter.id)) {
        deleteResourceFilter(resourceFilter.connectionId);
      }
    });
  }

  async onDragEnd({ destination, source }) {
    if (!destination) {
      return;
    }
    try {
      const { resources, refreshResources } = this.props;
      const { connectionId, isPrimary, rank: currentRank } = resources[
        source.index
      ];
      const { rank } = resources[destination.index];
      if (currentRank === rank) {
        return;
      }

      this.setState({ loading: true });
      await updateTopicResource(connectionId, {
        rank: currentRank > rank ? rank : rank + 1,
        primary: isPrimary,
      });
      await refreshResources();
      this.setState({ loading: false });
    } catch (e) {
      handleError(e.message);
    }
  }

  async onFilterSubmit(resourceId) {
    try {
      const { locale, refreshResources } = this.props;
      const { activeFilters } = this.state;
      this.setState({ error: '' });
      const resourceFilters = await fetchResourceFilter(resourceId, locale);
      const [
        createItems,
        deleteItems,
        updateItems,
      ] = sortIntoCreateDeleteUpdate({
        changedItems: activeFilters[resourceId],
        originalItems: resourceFilters,
        updateProperty: 'relevanceId',
      });
      await Promise.all([
        ...createItems.map(({ id: filterId, ...filter }) =>
          createResourceFilter({ filterId, resourceId, ...filter }),
        ),
        ...updateItems.map(filter =>
          updateResourceFilter(filter.connectionId, filter),
        ),
        ...deleteItems.map(filter => deleteResourceFilter(filter.connectionId)),
      ]);
      refreshResources();
      this.toggleFilterPicker(resourceId);
    } catch (e) {
      this.setState({
        error: `${this.props.t('taxonomy.errorMessage')}: ${e.message}`,
        filterPickerId: '',
      });
      handleError(e);
    }
  }

  toggleDelete(deleteId, resourceId) {
    this.setState({ deleteId, resourceId });
  }

  async toggleFilterPicker(id) {
    const { filterPickerId } = this.state;
    const { locale } = this.props;
    const isOpen = filterPickerId === id;
    if (!isOpen) {
      const resourceFilters = await fetchResourceFilter(id, locale);
      this.setState(prevState => ({
        activeFilters: {
          ...prevState.activeFilters,
          [id]: resourceFilters,
        },
        filterPickerId: id,
      }));
    } else {
      this.setState({
        filterPickerId: '',
      });
    }
  }

  updateFilter(resourceId, filterToUpdate, relevanceId, remove) {
    this.setState(prevState => {
      const currentFilters = prevState.activeFilters[resourceId];
      const newFilters = currentFilters.filter(
        filter => filter.id !== filterToUpdate.id,
      );
      if (!remove) {
        newFilters.push({ ...filterToUpdate, relevanceId });
      }
      return {
        activeFilters: {
          ...prevState.activeFilters,
          [resourceId]: newFilters,
        },
      };
    });
  }

  getResourceSubjects(resource) {
    const availableSubjects = [];
    if (resource.paths) {
      resource.paths.forEach(path => {
        availableSubjects.push(`urn:${path.split('/')[1]}`);
      });
    } else {
      const parentSubject = resource.path.split('/')[1];
      availableSubjects.push(`urn:${parentSubject}`);
    }
    return availableSubjects;
  }

  render() {
    const {
      contentType,
      resources,
      t,
      availableFilters,
      currentTopic,
      currentSubject,
      structure,
      locale,
    } = this.props;

    const {
      deleteId,
      resourceId,
      error,
      filterPickerId,
      activeFilters,
      loading,
    } = this.state;

    if (loading) {
      return <Spinner />;
    }
    return (
      <ul {...classes('list')}>
        <MakeDndList
          onDragEnd={this.onDragEnd}
          disableDnd={!!filterPickerId}
          dragHandle>
          {resources.map(resource => (
            <Resource
              key={resource.id}
              contentType={contentType}
              showFilterPicker={filterPickerId === resource.id}
              currentSubject={currentSubject}
              structure={structure}
              onFilterChange={this.updateFilter}
              onFilterSubmit={this.onFilterSubmit}
              toggleFilterPicker={this.toggleFilterPicker}
              onDelete={this.toggleDelete}
              currentTopic={currentTopic}
              resourceSubjects={this.getResourceSubjects(resource)}
              availableFilters={availableFilters}
              activeFilters={activeFilters[resource.id]}
              {...resource}
              locale={locale}
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
              onClick: () => this.onDelete(deleteId, resourceId),
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
  availableFilters: AvailableFiltersShape,
  activeFilter: PropTypes.string,
  currentTopic: PropTypes.shape({
    filters: PropTypes.array,
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  structure: PropTypes.arrayOf(StructureShape),
  locale: PropTypes.string,
};

export default injectT(ResourceItems);
