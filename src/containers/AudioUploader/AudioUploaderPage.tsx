/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { getLocale } from '../../modules/locale/locale';
import CreateAudio from './CreateAudio';
import EditAudio from './EditAudio';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LocationShape, HistoryShape, LocaleShape } from '../../shapes';
import { ReduxState } from '../../interfaces';

const mapDispatchToProps = {};

const mapStateToProps = (state: ReduxState) => {
  const locale = getLocale(state);
  return {
    locale,
  };
};

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

interface BaseProps {}

type Props = BaseProps & RouteComponentProps & PropsFromRedux & WithTranslation;

interface State {
  previousLocation: string;
}

class AudioUploaderPage extends Component<Props, State> {
  state = {
    previousLocation: '',
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ previousLocation: prevProps.location.pathname });
    }
  }

  render() {
    const { match, t, locale } = this.props;
    return (
      <div>
        <OneColumn>
          <HelmetWithTracker title={t('htmlTitles.audioUploaderPage')} />
          <Switch>
            <Route path={`${match.url}/new`} render={() => <CreateAudio locale={locale} />} />
            <Route
              path={`${match.url}/:audioId/edit/:audioLanguage`}
              render={props => (
                <EditAudio
                  audioId={props.match.params.audioId}
                  audioLanguage={props.match.params.audioLanguage}
                  isNewlyCreated={this.state.previousLocation === '/media/audio-upload/new'}
                  locale={locale}
                />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </OneColumn>
      </div>
    );
  }

  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({}).isRequired,
      isExact: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
    locale: LocaleShape.isRequired,
    history: HistoryShape,
    location: LocationShape,
  };
}

export default reduxConnector(withTranslation()(AudioUploaderPage));
