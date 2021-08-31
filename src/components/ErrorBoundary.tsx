/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import handleError from '../util/handleError';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | undefined;
}

class ErrorBoundary extends React.PureComponent<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
    handleError(error);
  }

  render() {
    const { t, children } = this.props;
    const { error } = this.state;
    if (error)
      return (
        <div>
          <h1>{t('errorMessage.title')}</h1>
          <div>{error.message}</div>
        </div>
      );
    return children;
  }
}

export default withTranslation()(ErrorBoundary);
