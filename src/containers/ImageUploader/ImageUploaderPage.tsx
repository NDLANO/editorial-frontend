/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useEffect, useRef } from 'react';
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
import { LocationShape } from '../../shapes';
import { ReduxState } from '../../interfaces';

const usePreviousLocation = (value: any) => {
  const ref = useRef();
  const actualRef = useRef();
  useEffect(() => {
    if (ref.current !== actualRef.current) {
      actualRef.current = ref.current;
    }
    ref.current = value;
  }, [value]);
  return actualRef.current;
};

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

interface Props extends tType, RouteComponentProps<MatchParams>, PropsFromRedux {}

const ImageUploaderPage: FC<Props> = ({ match, t, location, ...rest }) => {
  const prevLoc = usePreviousLocation(location.pathname);
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

// TODO:
// ImageUploaderPage.propTypes = {
//   match: PropTypes.shape({
//     url: PropTypes.string.isRequired,
//     params: PropTypes.shape({
//       imageId: PropTypes.string,
//       imageLanguage: PropTypes.string,
//     }),
//   }).isRequired,
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired,
//   }).isRequired,
//   isSaving: PropTypes.bool.isRequired,
//   location: LocationShape,
// };

export default connect(mapStateToProps)(injectT(ImageUploaderPage));
