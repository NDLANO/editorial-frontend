/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import {
  fetchTopicFilters,
  addFilterToTopic,
  updateTopicFilter,
  deleteTopicFilter,
} from '../../../modules/taxonomy';
import ConnectFilterItem from './ConnectFilterItem';
import Spinner from '../../../components/Spinner';
import Overlay from '../../../components/Overlay';
import { RESOURCE_FILTER_CORE } from '../../../constants';

class ConnectFilters extends Component {
  constructor() {
    super();
    this.state = {
      topicFilters: [],
      inputs: {},
      loading: false,
    };
    this.getFilters = this.getFilters.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getFilters();
  }

  async onSubmit() {
    const { subjectFilters, id } = this.props;
    const { topicFilters, inputs } = this.state;
    this.setState({ loading: true });
    await Promise.all([
      ...subjectFilters.filter(filter => !!inputs[filter.id]).map(filter => {
        const { active, relevance } = inputs[filter.id];
        const currentFilter = topicFilters.find(it => it.id === filter.id);
        if (active && !currentFilter) {
          // add filter to topic
          return addFilterToTopic({
            filterId: filter.id,
            topicId: id,
            relevanceId: relevance || RESOURCE_FILTER_CORE,
          });
        } else if (active && relevance !== currentFilter.relevanceId) {
          // update topic-filter with relevance
          return updateTopicFilter({
            connectionId: currentFilter.connectionId,
            relevanceId: relevance,
          });
        } else if (!active && currentFilter) {
          // delete topic-filter
          return deleteTopicFilter({
            connectionId: currentFilter.connectionId,
          });
        }
        return undefined;
      }),
    ]);
    const refreshedTopics = await fetchTopicFilters(this.props.id);
    const inputVals = refreshedTopics.reduce((acc, curr) => {
      acc[curr.id] = { active: true, relevance: curr.relevanceId };
      return acc;
    }, {});
    this.setState({
      loading: false,
      topicFilters: refreshedTopics,
      inputs: inputVals,
    });
  }

  async getFilters() {
    const topicFilters = await fetchTopicFilters(this.props.id);
    const inputs = topicFilters.reduce((acc, curr) => {
      acc[curr.id] = { active: true, relevance: curr.relevanceId };
      return acc;
    }, {});
    this.setState({ topicFilters, inputs, error: '' });
  }

  render() {
    const { subjectFilters, classes, t } = this.props;
    const { inputs, error, loading } = this.state;
    return (
      <form onSubmit={this.onSubmit} {...classes('editFilters')}>
        {loading && <Spinner cssModifier="absolute" />}
        {loading && (
          <Overlay cssModifiers={['absolute', 'white-opacity', 'zIndex']} />
        )}
        {subjectFilters.map(filter => (
          <ConnectFilterItem
            {...filter}
            inputValues={inputs[filter.id] || {}}
            onChange={val =>
              this.setState({
                inputs: {
                  ...inputs,
                  [filter.id]: {
                    ...inputs[filter.id],
                    ...val,
                  },
                },
              })
            }
            key={filter.id}
          />
        ))}
        <Button
          stripped
          {...classes('borderButton')}
          data-testid="submitConnectFilters"
          onClick={this.onSubmit}>
          {t('form.save')}
        </Button>
        {error && <div {...classes('errorMessage')}>{error}</div>}
      </form>
    );
  }
}

ConnectFilters.propTypes = {
  classes: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  subjectFilters: PropTypes.array,
};

export default injectT(ConnectFilters);
