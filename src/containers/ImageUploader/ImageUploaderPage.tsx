/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import loadable from '@loadable/component';
import { RoutePropTypes } from '../../shapes';
import { usePreviousLocation } from '../../util/routeHelpers';
const EditImage = loadable(() => import('./EditImage'));
const CreateImage = loadable(() => import('./CreateImage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface MatchParams {
  imageId?: string;
  imageLanguage?: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const ImageUploaderPage = ({ match, location, ...rest }: Props) => {
  const { t } = useTranslation();
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
  imageId: PropTypes.string,
  imageLanguage: PropTypes.string,
};

export default ImageUploaderPage;
