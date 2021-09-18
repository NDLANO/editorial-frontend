/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { match, Route, Switch } from 'react-router';
import { OneColumn } from '@ndla/ui';
import NdlaFilmEditor from './NdlaFilmEditor';
import Footer from '../App/components/Footer';

interface Props {
  match: match;
}

const NdlaFilm = ({ match }: Props) => {
  return (
    <>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/:selectedLanguage`}
            render={routeProps => {
              return <NdlaFilmEditor selectedLanguage={routeProps.match.params.selectedLanguage} />;
            }}
          />
          <Route
            path={`${match.url}`}
            render={() => {
              return <NdlaFilmEditor selectedLanguage={'nb'} />;
            }}
          />
        </Switch>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </>
  );
};

export default NdlaFilm;
