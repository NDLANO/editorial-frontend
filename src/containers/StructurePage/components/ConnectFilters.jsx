import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchSubjectFilters } from '../../../modules/taxonomy';
import ConnectFilterItem from './ConnectFilterItem';

class ConnectFilters extends Component {
  constructor() {
    super();
    this.state = {
      filters: [],
    };
    this.getFilters = this.getFilters.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getFilters();
  }

  async getFilters() {
    const filters = await fetchSubjectFilters(
      `urn:${this.props.path.split('/')[1]}`,
    );
    this.setState({ filters, error: '' });
  }

  async onSubmit(e) {
    console.log(e);
  }

  render() {
    const { classes, topicFilters } = this.props;
    return (
      <form onSubmit={this.onSubmit} {...classes('editFilters')}>
        {this.state.filters.map(filter => (
          <ConnectFilterItem
            {...filter}
            classes={classes}
            active={topicFilters.find(it => it.id === filter.id)}
          />
        ))}
      </form>
    );
  }
}

ConnectFilters.propTypes = {};

export default ConnectFilters;
