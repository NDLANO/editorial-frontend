/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';

import { getSaving } from '../../modules/audio/audio';
import { getShowSaved } from '../Messages/messagesSelectors';
import EditImage from './EditImage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const ImageUploaderPage = ({ match, ...rest }) => (
  <OneColumn>
    <Switch>
      <Route path={`${match.url}/new`} render={() => <EditImage {...rest} />} />
      <Route
        path={`${match.url}/:imageId/edit/:imageLanguage`}
        render={props => (
          <EditImage
            imageId={props.match.params.imageId}
            imageLanguage={props.match.params.imageLanguage}
            {...rest}
          />
        )}
      />
      <Route component={NotFoundPage} />
    </Switch>
  </OneColumn>
);

ImageUploaderPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      imageId: PropTypes.string,
      imageLanguage: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isSaving: getSaving(state),
  showSaved: getShowSaved(state),
});

export default connect(mapStateToProps)(ImageUploaderPage);
