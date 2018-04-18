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
import { ContentTypeBadge } from 'ndla-ui';
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
    await this.getAllResourceTypes();
    const topicId = this.props.params.topic2 || this.props.params.topic1;
    if (topicId) {
      this.getTopicResources(`urn:${topicId}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const topicId = nextProps.params.topic2 || nextProps.params.topic1;
    if (topicId) {
      this.getTopicResources(`urn:${topicId}`);
    } else {
      this.setState({ topicResources: [] });
    }
  }

  async getAllResourceTypes() {
    const resourceTypes = await fetchAllResourceTypes(this.props.locale);
    this.setState({ resourceTypes });
  }

  async getTopicResources(topicId) {
    const { locale } = this.props;
    const { resourceTypes } = this.state;

    const [
      coreTopicResources = [],
      supplementaryTopicResources = [],
    ] = await Promise.all([
      fetchTopicResources(topicId, locale, RESOURCE_FILTER_CORE),
      fetchTopicResources(topicId, locale, RESOURCE_FILTER_SUPPLEMENTARY),
    ]);

    const topicResources = groupSortResourceTypesFromTopicResources(
      resourceTypes,
      coreTopicResources,
      supplementaryTopicResources,
    );
    this.setState({ topicResources });
  }

  render() {
    return (
      <Fragment>
        {this.state.topicResources.map(topicResource => (
          <ResourceGroup
            key={topicResource.id}
            icon={
              <ContentTypeBadge background type={topicResource.contentType} />
            }
            {...{ topicResource }}
          />
        ))}
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
