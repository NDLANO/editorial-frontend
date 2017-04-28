/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { PageContainer } from 'ndla-ui';

import { MessageShape } from '../../shapes';
import Masthead from '../Masthead';
import Footer from './components/Footer';
import { getLocale } from '../Locale/localeSelectors';
import { getMessages } from '../Messages/messagesSelectors';
import Alerts from '../Messages/Alerts';
import { injectT } from '../../i18n';

export class App extends React.Component {
  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  render() {
    const { dispatch, children, messages, t, match: { params } } = this.props;
    return (
      <PageContainer>
        <Helmet
          title="NDLA"
          meta={[
            { name: 'description', content: t('meta.description') },
          ]}
        />

        <Masthead t={t} params={params} />
        {children}
        <Footer t={t} />
        <Alerts dispatch={dispatch} messages={messages} />
      </PageContainer>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

App.childContextTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  messages: getMessages(state),
});

export default withRouter(connect(mapStateToProps)(injectT(App)));
