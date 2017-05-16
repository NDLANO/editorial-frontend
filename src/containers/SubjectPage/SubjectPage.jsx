/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { OneColumn } from 'ndla-ui';
import { injectT } from '../../i18n';
import { fetchTopics, fetchSubject } from './subjectApi';
import { getAccessToken } from '../App/sessionSelectors';


class SubjectPage extends Component {

  constructor(props) {
    super(props);
    this.state = { topics: [] };
  }


  componentWillMount() {
    this.fetchData(this.props.match.params.subjectId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.subjectId !== this.props.match.params.subjectId) {
      this.fetchData(nextProps.match.params.subjectId);
    }
  }


  fetchData(subjectId) {
    const { token } = this.props;

    fetchSubject(token, subjectId).then(subject => this.setState({ subject }));

    fetchTopics(token, subjectId).then((topics) => {
      this.setState({ topics });
    }).catch((error) => {
      console.error(error); //eslint-disable-line
    });
  }

  render() {
    const { t } = this.props;
    const { topics, subject } = this.state;

    return (
      <div>
        <OneColumn>
          { subject ? <h1>{subject.name}</h1> : null}
          <h3>{t('subjectPage.topics')}</h3>
          <ul>
            {topics.map(topic => <li key={topic.id}>{topic.name}</li>)}
          </ul>
        </OneColumn>
      </div>
    );
  }
}

SubjectPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
};

const mapStateToProps = state => ({
  token: getAccessToken(state),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(SubjectPage);
