/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { SquareAudio, Camera } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import AudioUploaderPage from '../AudioUploader/AudioUploaderPage';
import ImageUploaderPage from '../ImageUploader/ImageUploaderPage';
import SubNavigation from '../Masthead/components/SubNavigation';
import Footer from './components/Footer';

const StyledMediaPage = styled('div')`
  background-color: ${colors.brand.greyLightest};
`;

const MediaPage = ({ match, t }) => {
  const supportedTypes = [
    {
      title: t('subNavigation.image'),
      type: 'image-upload',
      url: '/media/image-upload/new',
      icon: <Camera className="c-icon--large" />,
    },
    {
      title: t('subNavigation.audio'),
      type: 'audio-upload',
      url: '/media/audio-upload/new',
      icon: <SquareAudio className="c-icon--large" />,
    },
  ];

  return (
    <Fragment>
      <StyledMediaPage>
        <SubNavigation type="media" subtypes={supportedTypes} />
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
      </StyledMediaPage>
      <Footer showLocaleSelector={false} />
    </Fragment>
  );
};

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
