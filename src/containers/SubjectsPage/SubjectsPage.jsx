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
import { Link } from 'react-router-dom';
import { injectT } from '../../i18n';
import { fetchSubjects } from '../SubjectPage/subjectApi';
import { getAccessToken } from '../App/sessionSelectors';


class SubjectsPage extends Component {

  constructor(props) {
    super(props);
    this.state = { subjects: [], msg: '' };
  }

  componentWillMount() {
    const { token } = this.props;
    fetchSubjects(token).then((subjects) => {
      this.setState({ subjects, msg: 'success' });
    }).catch((error) => {
      this.setState({ msg: 'error' });
      console.error(error); //eslint-disable-line
    });
  }

  render() {
    const { t } = this.props;
    const { subjects, msg } = this.state;

    return (
      <div>
        <OneColumn>
          <h1>{t('subjectsPage.subjects')} - {msg}</h1>
          <ul>
            {subjects.map(subject =>
              <li key={subject.id}>
                <Link to={`/subjects/${subject.id}`}>{subject.name}</Link>
              </li>)
             }
          </ul>
        </OneColumn>
      </div>
    );
  }
}

SubjectsPage.propTypes = {
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
)(SubjectsPage);
