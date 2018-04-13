import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import {
  fetchSubjectFilters,
  fetchTopicFilters,
  addFilterToTopic,
} from '../../../modules/taxonomy';
import ConnectFilterItem from './ConnectFilterItem';
import Spinner from '../../../components/Spinner';

class ConnectFilters extends Component {
  constructor() {
    super();
    this.state = {
      subjectFilters: [],
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
    const { id } = this.props;
    const { subjectFilters, inputs } = this.state;
    this.setState({ loading: true });
    await Promise.all([
      ...subjectFilters.filter(filter => !!inputs[filter.id]).map(filter => {
        if (inputs[filter.id].active) {
          addFilterToTopic({
            filterId: filter.id,
            topicId: id,
            relevanceId: inputs[filter.id].relevance,
          });
        } else if (inputs[filter.id].relevance) {
          // update topic-filter with relevance
          console.log('update', filter.id);
        } else {
          // delete topic-filter
          console.log('delete', filter.id);
        }
      }),
    ]);
    const refreshedTopics = await fetchTopicFilters(this.props.id);
    this.setState({ loading: false, topicFilters: refreshedTopics });
  }

  async getFilters() {
    const [subjectFilters, topicFilters] = await Promise.all([
      fetchSubjectFilters(`urn:${this.props.path.split('/')[1]}`),
      fetchTopicFilters(this.props.id),
    ]);
    this.setState({ subjectFilters, topicFilters, error: '' });
  }

  render() {
    const { classes, t } = this.props;
    const { subjectFilters, topicFilters, inputs, error, loading } = this.state;
    return (
      <form onSubmit={this.onSubmit} {...classes('editFilters')}>
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
            active={topicFilters.find(it => it.id === filter.id)}
          />
        ))}
        <Button onClick={this.onSubmit}>
          {loading ? <Spinner /> : t('form.save')}
        </Button>
        {error && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {error}
          </div>
        )}
      </form>
    );
  }
}

ConnectFilters.propTypes = {
  classes: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
};

export default injectT(ConnectFilters);
