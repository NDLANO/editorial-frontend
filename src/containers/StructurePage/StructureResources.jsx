/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';

import ResourceGroup from './components/ResourceGroup';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';
import { groupSortResourceTypesFromTopicResources } from '../../util/taxonomyHelpers';
import {
  fetchAllResourceTypes,
  fetchTopicResources,
} from '../../modules/taxonomy';

export class StructureResources extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: [],
      topicResources: [],
    };
    this.getAllResourceTypes = this.getAllResourceTypes.bind(this);
    this.getTopicResources = this.getTopicResources.bind(this);
  }

  async componentDidMount() {
    try {
      const { params: { topic1, topic2, topic3 } } = this.props;
      await this.getAllResourceTypes();
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
    } catch (error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params: { topic1, topic2, topic3 } } = nextProps;
    if (nextProps.params !== this.props.params) {
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
    }
  }

  async getAllResourceTypes() {
    try {
      const resourceTypes = await fetchAllResourceTypes(this.props.locale);
      this.setState({ resourceTypes });
    } catch (error) {
      console.log(error);
    }
  }

  async getTopicResources(topicId) {
    if (topicId) {
      const { locale } = this.props;
      const { resourceTypes } = this.state;
      const fullId = `urn:${topicId}`;
      try {
        const [
          coreTopicResources = [],
          supplementaryTopicResources = [],
        ] = await Promise.all([
          fetchTopicResources(fullId, locale, RESOURCE_FILTER_CORE),
          fetchTopicResources(fullId, locale, RESOURCE_FILTER_SUPPLEMENTARY),
        ]);

        const topicResources = groupSortResourceTypesFromTopicResources(
          resourceTypes,
          coreTopicResources,
          supplementaryTopicResources,
        );
        this.setState({ topicResources });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ topicResources: [] });
    }
  }

  render() {
    const { params: { topic1, topic2, topic3 } } = this.props;
    return (
      <Fragment>
        {this.state.resourceTypes.map(resourceType => {
          const topicResource =
            this.state.topicResources.find(
              resource => resource.id === resourceType.id,
            ) || {};
          return (
            <ResourceGroup
              key={resourceType.id}
              resource={resourceType}
              topicResource={topicResource}
              params={this.props.params}
              refreshResources={() =>
                this.getTopicResources(topic3 || topic2 || topic1)
              }
            />
          );
        })}
      </Fragment>
    );
  }
}

StructureResources.propTypes = {
  locale: PropTypes.string,
  params: PropTypes.shape({
    topic1: PropTypes.string,
    topic2: PropTypes.string,
  }).isRequired,
};

export default injectT(StructureResources);
