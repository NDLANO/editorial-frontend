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
} from '../../../modules/taxonomy';
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
  }

  async onDelete(id) {
    try {
      this.setState({ deleteId: '' });
      await deleteTopicResource(id);
      this.props.refreshResources();
    } catch (error) {
      console.log(error);
    }
  }

  async toggleRelevance(resourceId, relevance) {
    const { activeFilter, locale, refreshResources } = this.props;
    const newRelevance =
      relevance === RESOURCE_FILTER_CORE
        ? RESOURCE_FILTER_SUPPLEMENTARY
        : RESOURCE_FILTER_CORE;
    const resourceFilters = await fetchResourceFilter(resourceId, locale);
    const ok = await updateResourceRelevance(
      resourceFilters.find(filter => filter.id === activeFilter).connectionId,
      newRelevance,
    );

    if (ok) refreshResources();
  }

  render() {
    const { contentType, resources, t, activeFilter } = this.props;
    return (
      <ul {...classes('list')}>
        {resources.map(resource => (
          <Resource
            key={resource.id}
            contentType={contentType}
            resource={resource}
            onDelete={() => this.setState({ deleteId: resource.connectionId })}
            toggleRelevance={
              activeFilter &&
              (() => this.toggleRelevance(resource.id, resource.relevance))
            }
            relevance={resource.relevance}
          />
        ))}
        {this.state.deleteId && (
          <WarningModal
            confirmDelete
            text={t('taxonomy.resource.confirmDelete')}
            onContinue={() => this.onDelete(this.state.deleteId)}
            onCancel={() => this.setState({ deleteId: '' })}
          />
        )}
      </ul>
    );
  }
}

ResourceItems.propTypes = {
  contentType: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
  classes: PropTypes.func,
  refreshResources: PropTypes.func,
  activeFilter: PropTypes.string,
};

export default injectT(ResourceItems);
