/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { css } from 'react-emotion';
import isEqual from 'lodash/fp/isEqual';
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
import handleError from '../../../util/handleError';

const borderButtonStyle = css`
  &,
  &:hover,
  &:focus {
    border: 1px solid ${colors.brand.grey};
    border-radius: 3px;
    width: 100px;
  }
`;

class ConnectFilters extends Component {
  constructor() {
    super();
    this.state = {
      inputs: {},
      loading: false,
    };
    this.getInputsFromProps = this.getInputsFromProps.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getInputsFromProps();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.topicFilters, this.props.topicFilters))
      this.getInputsFromProps();
  }

  async onSubmit() {
    const { subjectFilters, id } = this.props;
    const { inputs } = this.state;
    this.setState({ loading: true, error: '' });
    try {
      const topicFiltersWithConnectionId = await fetchTopicFilters(
        this.props.id,
      );
      await Promise.all([
        ...subjectFilters.filter(filter => !!inputs[filter.id]).map(filter => {
          const { active, relevance } = inputs[filter.id];
          const currentFilter = topicFiltersWithConnectionId.find(
            it => it.id === filter.id,
          );
          if (active && !currentFilter) {
            // add filter to topic
            return addFilterToTopic({
              filterId: filter.id,
              topicId: id,
              relevanceId: relevance || RESOURCE_FILTER_CORE,
            });
          }
          if (active && relevance !== currentFilter.relevanceId) {
            // update topic-filter with relevance
            return updateTopicFilter({
              connectionId: currentFilter.connectionId,
              relevanceId: relevance,
            });
          }
          if (!active && currentFilter) {
            // delete topic-filter
            return deleteTopicFilter({
              connectionId: currentFilter.connectionId,
            });
          }
          return undefined;
        }),
      ]);
      this.props.refreshTopics();
      this.setState({
        loading: false,
      });
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
    }
  }

  getInputsFromProps() {
    const inputVals = this.props.topicFilters.reduce((acc, curr) => {
      acc[curr.id] = { active: true, relevance: curr.relevanceId };
      return acc;
    }, {});
    this.setState({ inputs: inputVals });
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
          css={borderButtonStyle}
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
  subjectFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  topicFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  refreshTopics: PropTypes.func,
};

export default injectT(ConnectFilters);
