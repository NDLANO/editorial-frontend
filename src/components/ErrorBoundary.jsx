import React from 'react';
import { injectT } from '@ndla/i18n';
import PropTypes from 'prop-types';
import handleError from '../util/handleError';

class ErrorBoundary extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidCatch(error) {
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

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  t: PropTypes.func,
};

export default injectT(ErrorBoundary);
