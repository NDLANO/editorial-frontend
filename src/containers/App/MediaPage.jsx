/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SquareAudio, Camera } from 'ndla-icons/editor';
import { injectT } from 'ndla-i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import AudioUploaderPage from '../AudioUploader/AudioUploaderPage';
import ImageUploaderPage from '../ImageUploader/ImageUploaderPage';
import TypeMenu from './TypeMenu';

const DEFAULT_TYPE = 'image-upload';

class MediaPage extends React.Component {
  constructor() {
    super();
    this.state = {
      type: DEFAULT_TYPE,
    };
  }
  componentWillMount() {
    const { location: { pathname } } = this.props;
    const splittedPathname = pathname.split('/');
    const type =
      splittedPathname.length > 3 ? splittedPathname[2] : DEFAULT_TYPE;
    this.setState({ type });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname } } = nextProps;
    const splittedPathname = this.props.location.pathname.split('/');
    const type =
      splittedPathname.length > 3 ? splittedPathname[2] : DEFAULT_TYPE;

    const nextSplittedPathname = pathname.split('/');
    const nextType =
      nextSplittedPathname.length > 3 ? nextSplittedPathname[2] : DEFAULT_TYPE;
    if (type !== nextType) {
      this.setState({ type: nextType });
    }
  }

  render() {
    const { match, t } = this.props;
    const supportedTypes = [
      {
        title: t('typeMasthead.image'),
        type: 'image-upload',
        url: '/media/image-upload/new',
        icon: <Camera className="c-icon--large" />,
      },
      {
        title: t('typeMasthead.audio'),
        type: 'audio-upload',
        url: '/media/audio-upload/new',
        icon: <SquareAudio className="c-icon--large" />,
      },
    ];

    return (
      <div>
        <TypeMenu
          type="media"
          subtypes={supportedTypes}
          activeSubtype={this.state.type}
        />
        <Switch>
          <PrivateRoute
            path={`${match.url}/image-upload`}
            component={ImageUploaderPage}
          />
          <PrivateRoute
            path={`${match.url}/audio-upload`}
            component={AudioUploaderPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

MediaPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(withRouter(MediaPage));
