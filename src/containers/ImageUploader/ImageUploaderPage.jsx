/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import { getSaving } from '../../modules/image/image';
import { getShowSaved } from '../Messages/messagesSelectors';
import EditImage from './EditImage';
import CreateImage from './CreateImage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ImageUploaderPage = ({ match, t, location, ...rest }) => {



  //const qwe = useRef();

  const prevLoc = usePrevious(location.pathname);

  console.log("actual location: ", location.pathname);
  //console.log("previous location: ", previousLocation);
  console.log("qwe location: ", prevLoc)



  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.imageUploaderPage')}/>
      <Switch>
        <Route
          path={`${match.url}/new`}
          render={() => <CreateImage {...rest} />}
        />
        <Route
          path={`${match.url}/:imageId/edit/:imageLanguage`}
          render={props => (
            <EditImage
              imageId={props.match.params.imageId}
              imageLanguage={props.match.params.imageLanguage}
              isNewlyCreated={prevLoc === '/media/image-upload/new'}
              {...rest}
            />
          )}
        />
        <Route component={NotFoundPage}/>
      </Switch>
    </OneColumn>
  );
};

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
  location: PropTypes.string,
};

const mapStateToProps = state => ({
  isSaving: getSaving(state),
  showSaved: getShowSaved(state),
});

export default injectT(connect(mapStateToProps)(ImageUploaderPage));
