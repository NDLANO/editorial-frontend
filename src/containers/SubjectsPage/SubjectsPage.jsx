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
import { uuid } from 'ndla-util';
// import { Link } from 'react-router-dom';
import { injectT } from '../../i18n';
import { fetchSubjects } from './subjectsApi';
import { getAccessToken } from '../App/sessionSelectors';


class SubjectPage extends Component {

  constructor(props) {
    super(props);
    this.state = { subjects: [], hasFetched: false };
  }

  componentWillMount() {
    const { token } = this.props;
    fetchSubjects(token).then((subjects) => {
      this.setState({ subjects, hasFetched: true });
    }).catch((error) => {
      console.error(error); //eslint-disable-line
    });
  }

  render() {
    const { t } = this.props;
    const { subjects, hasFetched } = this.state;

    return (
      <div>
        <OneColumn>
          <h1>{t('subjectsPage.subjects')}</h1>
          <ul>
            {subjects.map(subject => <li key={uuid()}>{subject.name}</li>)}
          </ul>
        </OneColumn>
      </div>
    );
  }
}

SubjectPage.propTypes = {
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
