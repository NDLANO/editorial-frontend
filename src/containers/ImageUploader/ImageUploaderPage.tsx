/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import { RouteComponentProps } from 'react-router';
import { getSaving } from '../../modules/image/image';
import { getShowSaved } from '../Messages/messagesSelectors';
import EditImage from './EditImage';
import CreateImage from './CreateImage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { RoutePropTypes } from '../../shapes';
import { ReduxState } from '../../interfaces';
import { usePreviousLocation } from '../../util/routeHelpers';

interface MatchParams {
  imageId?: string;
  imageLanguage?: string;
}

const mapStateToProps = (state: ReduxState) => ({
  isSaving: getSaving(state),
  showSaved: getShowSaved(state),
});

const reduxConnector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

type Props = tType & RouteComponentProps<MatchParams> & PropsFromRedux;

const ImageUploaderPage = ({ match, t, location, ...rest }: Props) => {
  const prevLoc = usePreviousLocation();
  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.imageUploaderPage')} />
      <Switch>
        <Route path={`${match.url}/new`} render={() => <CreateImage {...rest} />} />
        <Route
          path={`${match.url}/:imageId/edit/:imageLanguage`}
          render={props => (
            <EditImage
              imageId={props.match.params.imageId}
              imageLanguage={props.match.params.imageLanguage}
              isNewlyCreated={prevLoc === '/media/image-upload/new'}
            />
          )}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

ImageUploaderPage.propTypes = {
  ...RoutePropTypes,
  isSaving: PropTypes.bool.isRequired,
  imageId: PropTypes.string,
  imageLanguage: PropTypes.string,
};

export default reduxConnector(injectT(ImageUploaderPage));
