/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import Footer from '../App/components/Footer';
const CreateConcept = loadable(() => import('./CreateConcept'));
const EditConcept = loadable(() => import('./EditConcept'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface BaseProps {}

type Props = BaseProps & RouteComponentProps;

const ConceptPage = (props: Props) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const prevProps = useRef<Props | undefined>(undefined);
  const { i18n } = useTranslation();

  const { match, location, ...propsRest } = props;
  const rest = { locale: i18n.language, ...propsRest };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prevProps.current && location.pathname !== prevProps.current.location.pathname) {
      setPreviousLocation(prevProps.current.location.pathname);
    }
    prevProps.current = props;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Switch>
          <Route path={`${match.url}/new`} render={() => <CreateConcept {...rest} />} />
          <Route
            path={`${match.url}/:conceptId/edit/:selectedLanguage`}
            render={routeProps => (
              <EditConcept
                conceptId={routeProps.match.params.conceptId}
                selectedLanguage={routeProps.match.params.selectedLanguage}
                isNewlyCreated={previousLocation === '/concept/new'}
                {...rest}
              />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </div>
  );
};

export default memo(ConceptPage);
